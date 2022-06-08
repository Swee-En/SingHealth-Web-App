var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "institutionId" [optional]: integer
 * }
 * 
 * Returns:
 * - [list of {
 *      "auditId": auditId integer,
 *      "date": YYYY-MM-DD string,
 *      "staffId": staffId integer,
 *      "staffName": string,
 *      "outletId": outletId integer,
 *      "outletAddress": string,
 *      "tenantId": tenantId integer,
 *      "tenantName": string,
 *      "result": JSON string,
 *      "resolved": boolean
 *   }] (200)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * FOR NON-TENANT USE - STAFF CANNOT USE INSTITUTIONID
 */
router.post('/',async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(("institutionId" in req.body)&&(!securityTools.checkInteger(req.body["institutionId"])))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req, async (dbo,auth)=>{
        var queryInt = null;
        if (auth["type"]===2) return db.returnNotPermittedError();
        if (auth["type"]===1) {
            if ("institutionId" in req.body) return db.returnNotPermittedError();
            req.body["institutionId"] = auth["institution"];
        }
        else {
            if (("institutionId" in req.body)&&(req.body["institutionId"]!==auth["institution"])){
                queryInt = await db.performTransactionStep(dbo,`SELECT id FROM t1 WHERE id=${req.body["institutionId"]};`);
                if (queryInt.length===0) return {"error": "INSTITUTION_NOT_FOUND"};
            }
            else if (!("institution" in req.body)) req.body["institutionId"] = auth["institution"];
        }

        var queryInt = await db.performTransactionStep(dbo,
            `SELECT t5.id AS "auditId", date, t5.t2_id_1 AS "staffId", t2a.name AS "staffName", t4_id AS "outletId", t4.address as "outletAddress", `
            + `t5.t2_id_2 AS "tenantId", t2b.name AS "tenantName", t5.result AS result, t5.resolved AS resolved `
            + `FROM t4 INNER JOIN t5 ON t4.id=t5.t4_id INNER JOIN t2 AS t2a ON t5.t2_id_1=t2a.id INNER JOIN t2 AS t2b ON t5.t2_id_2=t2b.id `
            + `WHERE t4.t1_id=${req.body["institutionId"]};`
        );
        for (var i in queryInt) {
            queryInt[i]["date"] = utils.intToDateString(queryInt[i]["date"].valueOf());
        }
        return queryInt;
    });

    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;