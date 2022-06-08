var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "auditId": integer,
 *      "description": string,
 *      "deadline": YYYY-MM-DD string
 * }
 * 
 * For starting issues. This sets the relevant audit to non-resolved
 * 
 * Returns:
 * - {"issueId": issueId integer} (200)
 * - {"error": "AUDIT_NOT_FOUND"} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE TO STAFF ONLY. STAFF CAN ONLY SUBMIT FOR OWN INSTITUTION
 */
router.post('/',async function (req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId","auditId","description","deadline"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!securityTools.checkInteger(req.body["auditId"]))
        ||(!(typeof req.body["description"]==='string'))
        ||(!securityTools.checkSanitizedDate(req.body["deadline"]))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        if (auth["type"]!==1) return db.returnNotPermittedError();
       
        var queryInt = db.performTransactionStep(dbo,
            `SELECT t4.t1_id AS "institutionId" FROM t4 INNER JOIN t5 ON t5.t4_id=t4.id WHERE t5.id=${req.body["auditId"]};`
        );
        if (queryInt.length===0) return {"error": "AUDIT_NOT_FOUND"};
        if (queryInt[0]["institutionId"]!==auth["institution"]) return db.returnNotPermittedError();

        queryInt = db.performTransactionStep(dbo,
            `UPDATE t5 SET resolved=FALSE WHERE id=${req.body["auditId"]} RETURNING id;`
        );
        if (queryInt.length===0) throw false;

        queryInt = db.performTransactionStep(dbo,
            `INSERT INTO t6 (t5_id,descr,dl,resolved) VALUES (`
            + `${req.body["auditId"]}, `
            + `${btoa(req.body["description"])}, `
            + `${req.body["deadline"]}, `
            + `FALSE) RETURNING id;`    
        );
        if (queryInt.length===0) throw false;
        return {"issueId": queryInt[0]["int"]};
    });
    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;