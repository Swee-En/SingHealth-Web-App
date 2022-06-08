var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "institutionId" [optional for admin]: integer
 * }
 * 
 * Returns:
 * - [list of {
 *      "outletId": outletId integer,
 *      "institutionId": institutionId integer,
 *      "institutionName": string,
 *      "institutionAddress": string,
 *      "tenantId": userId integer,
 *      "address": string,
 *      "checklist": JS object,
 *      "validity_start": YYYY-MM-DD date string,
 *      "validity_end": YYYY-MM-DD date string
 *   }] (200)
 * - {"error": "INSTITUTION_NOT_FOUND"}
 * - Default service error (500)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * CAN ONLY BE INVOKED BY NON-TENANTS. STAFF CANNOT USE INSTITUTIONID
 */
router.post('/',async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionList"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(("institutionId" in req.body)&&(!securityTools.checkInteger(req.body["institutionId"])))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{

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
        }

        var selectQuery = "";
        if ("institution" in req.body) {
            selectQuery = ` WHERE t1.id=${req.body["institutionId"]}`;
        }
        
        queryInt = await db.performTransactionStep(dbo,
            `SELECT t4.id AS outletId, t4.t1_id AS "institutionId", t1.name AS "institutionName", t1.address AS "institutionAddress", t1.t2_id AS "tenantId", `
            + `t4.address AS address, t4.checklist AS checklist, t4.validity_start AS "validity_start", t4.validity_end AS "validity_end" FROM t4 LEFT OUTER JOIN t2 ON t4.t1_id=t1.id`
            + `${selectQuery};`
        );

        for (var i in queryInt) {
            queryInt[i]["checklist"] = JSON.parse(queryInt[i]["checklist"]);
            queryInt[i]["validity_start"] = queryInt[i]["validity_start"]===null? null : utils.intToDateString(queryInt[i]["validity_start"].valueOf());
            queryInt[i]["validity_end"] = queryInt[i]["validity_end"]===null? null : utils.intToDateString(queryInt[i]["validity_end"].valueOf());
        }

        return queryInt;
    });

    if (db.handleIfGeneralError(result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;