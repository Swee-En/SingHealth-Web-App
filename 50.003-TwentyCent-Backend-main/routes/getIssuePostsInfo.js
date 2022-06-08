var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "issueId" : integer
 * }
 * 
 * Returns:
 * - [list of {
 *      "issuePostId": issuePostId integer,
 *      "issueId": issueId integer,
 *      "senderId": userId integer,
 *      "message": string,
 *      "attachment": null or Base64string,
 *      "time": integer
 *   }] (200)
 * - {"error": "ISSUE_NOT_FOUND"}
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE FOR ALL, BUT TENANTS CAN ONLY ACCESS OWN ISSUES, AND STAFF CAN ONLY ACCESS FROM OWN INSTITUTION
 */
router.post('/',async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId","issueId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["issueId"]))
        ||(!securityTools.checkInteger(req.body["auditId"]))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req, async (dbo,auth)=>{
        var queryInt = null;

        switch (auth["type"]) {
            case 0:
                queryInt = await db.performTransactionStep(dbo,
                    `SELECT id FROM t6 where id=${req.body["issueId"]};`
                );
                if (queryInt.length===0) return {"error": "ISSUE_NOT_FOUND"};
                break;
            case 1:
                queryInt = await db.performTransactionStep(dbo,
                    `SELECT t1.id AS institution FROM t6 INNER JOIN t5 ON t6.t5_id=t5.id `
                    `INNER JOIN t4 ON t5.t4_id=t4.id INNER JOIN t1 ON t4.t1_id=t1.id WHERE t6.id=${req.body["issueId"]};`
                );
                if (queryInt.length===0) return {"error": "ISSUE_NOT_FOUND"};
                if (queryInt[0]["institution"]!=auth["institution"]) return db.returnNotPermittedError();
                break;
            case 2:
                queryInt = await db.performTransactionStep(dbo,
                    `SELECT t5.t2_id_2 AS "tenantId" FROM t5 INNER JOIN t6 ON t6.t5_id=t5.id where t6.id=${req.body["issueId"]};`
                );
                if (queryInt.length===0) return {"error": "ISSUE_NOT_FOUND"};
                if (queryInt[0]["tenantId"]!=auth["id"]) return db.returnNotPermittedError();
                break;
        }

        queryInt = await db.performTransactionStep(dbo,
            `SELECT id AS "issuePostId", t6_id AS "issueId", t2_id AS "senderId", msg AS message, atch AS attachment, time FROM t9 WHERE t6_id=${req.body["issueId"]};`
        );
        for (var i in queryInt) {
            queryInt[i]["message"] = utils.atob(queryInt[i]["message"]);
        }
        return queryInt;
    });

    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;