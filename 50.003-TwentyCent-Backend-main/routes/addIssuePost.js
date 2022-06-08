var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "issueId": integer,
 *      "message": raw string,
 *      "attachment": Base64 string or null,
 *      "time": integer
 * }
 * 
 * Returns:
 * - {"issuePostId": issuePostId integer} (200)
 * - {"error": "ISSUE_NOT_FOUND"} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * 
 * ACCESSIBLE TO ALL, BUT STAFF CAN ONLY POST IN OWN INSTITUTION, AND TENANTS ON OWN ISSUES
 */
router.post('/',async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId","issueId","message","attachment","time"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!securityTools.checkInteger(req.body["issueId"]))
        ||(typeof req.body["message"]!=='string')
        ||(!securityTools.checkAttachment(req.body["attachment"]))
        ||(!securityTools.checkInteger(req.body["time"]))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    var result = await db.makeTransaction(req,(dbo,auth)=>{
        
        var queryInt = null;
        
        switch (auth["type"]) {
            case 0:
                queryInt = db.performTransactionStep(dbo,
                    `SELECT id FROM t6 WHERE id=${req.body["issueId"]};`
                );
                if (queryInt.length===0) return {"error": "ISSUE_NOT_FOUND"};
                break;
            case 1:
                queryInt = db.performTransactionStep(dbo,
                    `SELECT t4.t1_id AS "institutionId" FROM t6 INNER JOIN t5 ON t6.t5_id=t5.id INNER JOIN t4 ON t5.t4_id=t4.id WHERE t6.id=${req.body["issueId"]};`
                );
                if (queryInt.length===0) return {"error": "ISSUE_NOT_FOUND"};
                if (queryInt[0]["institutionId"]!==auth["institution"]) return db.returnNotPermittedError();
                break;
            case 2:
                queryInt = db.performTransactionStep(dbo,
                    `SELECT t4.t2_id AS "tenantId" FROM t6 INNER JOIN t5 ON t6.t5_id=t5.id INNER JOIN t4 ON t5.t4_id=t4.id WHERE t6.id=${req.body["issueId"]};`
                );
                if (queryInt.length===0) return {"error": "ISSUE_NOT_FOUND"};
                if (queryInt[0]["tenantId"]!==auth["id"]) return db.returnNotPermittedError();
                break;
        }

        queryInt = db.performTransactionStep(dbo,
            `INSERT INTO t9 (t6_id,t2_id,msg,atch,time) VALUES (`
            + `${req.body["issueId"]},${auth["id"]},\'${btoa(req.body["message"])}\',`
            + `${req.body["attachment"]===null?NULL:"\'"+req.body["attachment"]+"\'"},${req.body["time"]} RETURNING id;`
        );
        if (queryInt.length===0) throw false;
        return {"issuePostId": queryInt[0]["id"]};
    });
    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;