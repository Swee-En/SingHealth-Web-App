var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric
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
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * CAN BE INVOKED BY TENANTS ONLY (LOGICALLY ADMIN/STAFF CAN USE THIS ALSO, BUT IT'S BETTER TO USE GETOUTLETLIST)
 */
router.post('/', async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionid"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if (!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        if (auth["type"]!==2) return db.returnNotPermittedError();

        var queryInt = await db.performTransactionStep(dbo,
            `SELECT t4.id AS "outletId", t4.t1_id AS "institutionId", t1.name AS "institutionName", t1.address AS "institutionAddress", t1.t2_id AS "tenantId", `
            + `t4.address AS address, t4.checklist AS checklist, t4.validity_start AS "validity_start", t4.validity_end AS "validity_end" FROM t4 INNER JOIN t2 ON t4.t1_id=t1.id `
            + `WHERE t2_id=${auth["id"]};`
        );
        for (var i in queryInt) {
            queryInt[i]["checklist"] = JSON.parse(queryInt[i]["checklist"]);
            queryInt[i]["validity_start"] = queryInt[i]["validity_start"]===null? null : utils.intToDateString(queryInt[i]["validity_start"].valueOf());
            queryInt[i]["validity_end"] = queryInt[i]["validity_end"]===null? null : utils.intToDateString(queryInt[i]["validity_end"].valueOf());
        }
        return queryInt;
    });
    
    if (db.handleIfGeneralError(res,result)) return;

    res.status(200).json(result);
    return;

});
module.exports = router;