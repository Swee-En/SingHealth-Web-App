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
 *      "auditId": auditId integer,
 *      "date": YYYY-MM-DD string,
 *      "staffId": staffId integer,
 *      "staffName": string,
 *      "outletId": outletId integer,
 *      "outletAddress": string,
 *      "tenantId": tenantId integer,
 *      "result": JSON string,
 *      "resolved": boolean
 *   }] (200)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * FOR TENANT USE ONLY (STAFF/ADMIN SHOULD USE GETAUDITLIST)
 */

router.post('/',async function(req,res) {
    if (!utils.checkRequestCompleteness(req,["sessionId"])){
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if (!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        if (auth["type"]!==2) db.returnNotPermittedError();

        var currentDateString = utils.intToDateString(Date.now());

        var queryInt = await db.performTransactionStep(dbo,
            `SELECT t3.id AS "auditId", date, t2_id_1 AS "staffId", t2.name AS "staffName", t4_id AS "outletId", t4.address as "outletAddress" `
            + `t2_id_2 AS "tenantId", result, resolved `
            + `FROM t4 INNER JOIN t5 ON t4.id=t5.t4_id INNER JOIN t2 ON t2_id_1=t2.id WHERE t2_id_1=${auth["id"]} `
            + `AND validity_start<=\'${currentDateString}\' AND validity_end>=\'${currentDateString}\';`
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