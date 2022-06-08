var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "auditId" : integer
 * }
 * 
 * Returns:
 * - [list of {
 *      "issueId": issueId integer,
 *      "auditId": auditId integer,
 *      "description": string,
 *      "deadline": YYYY-MM-DD string,
 *      "resolved": boolean
 *   }] (200)
 * - {"error": "AUDIT_NOT_FOUND"}
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE FOR ALL, BUT TENANTS CAN ONLY ACCESS OWN ISSUES, AND STAFF CAN ONLY ACCESS FROM OWN INSTITUTION
 */
router.post('/',async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId","auditId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!securityTools.checkInteger(req.body["auditId"]))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req, async (dbo,auth)=>{
        var queryInt = null;

        switch (auth["type"]) {
            case 0:
                queryInt = await db.performTransactionStep(dbo,
                    `SELECT id FROM t5 where id=${req.body["auditId"]};`
                );
                if (queryInt.length===0) return {"error": "AUDIT_NOT_FOUND"};
                break;
            case 1:
                queryInt = await db.performTransactionStep(dbo,
                    `SELECT t1.id AS institution FROM t5 INNER JOIN t4 ON t5.t4_id=t4.id INNER JOIN t1 ON t4.t1_id=t1.id WHERE t5.id=${req.body["auditId"]};`
                );
                if (queryInt.length===0) return {"error": "AUDIT_NOT_FOUND"};
                if (queryInt[0]["institution"]!=auth["institution"]) return db.returnNotPermittedError();
                break;
            case 2:
                queryInt = await db.performTransactionStep(dbo,
                    `SELECT t2_id_2 AS "tenantId" FROM t5 where id=${req.body["auditId"]};`
                );
                if (queryInt.length===0) return {"error": "AUDIT_NOT_FOUND"};
                if (queryInt[0]["tenantId"]!=auth["id"]) return db.returnNotPermittedError();
                break;
        }

        queryInt = await db.performTransactionStep(dbo,
            `SELECT id AS "issueId", t5_id AS "auditId", descr AS description, dl AS deadline, resolved FROM t6 WHERE t5_id=${req.body["auditId"]};`
        );
        for (var i in queryInt) {
            queryInt[i]["description"] = utils.atob(queryInt[i]["description"]);
            queryInt[i]["deadline"] = utils.intToDateString(queryInt[i]["deadline"].valueOf());
        }
        return queryInt;
    });

    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;