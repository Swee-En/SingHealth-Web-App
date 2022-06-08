var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "type" [optional]: integer,
 *      "institutionId" [optional]: integer
 * }
 * 
 * Returns:
 * - [ list of {
 *      "userId": userId integer,
 *      "name": string,
 *      "type": integer,
 *      "email": string,
 *      "institutionId": institutionId integer,
 *      "institutionName": string,
 *      "username": string
 *   }] (200)
 * - Default service error (500)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * CAN ONLY BE INVOKED BY NON-TENANTS, BUT STAFF CAN ONLY SEE DATA FROM OWN INSTITUTION
 */
router.post('/',async function(req,res) {
    if (!utils.checkRequestCompleteness(req,["sessionId"])){
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(("type" in req.body)&&(!securityTools.checkInteger(req.body["type"])))
        ||(("institutionId" in req.body)&&(!securityTools.checkInteger(req.body["institutionId"])))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        if (auth["type"]===2) return db.returnNotPermittedError();

        var queryField = [];
        if ((auth["type"]===1)) {
            if (("institution" in req.body)&&(auth["institution"]!==req.body["institution"])) return db.returnNotPermittedError();
            queryField.push(`t2.t1_id=${auth["institution"]}`);
        }

        if ("type" in req.body) queryField.push(`type=${req.body["type"]}`);
        if ((auth["type"]===0) && ("institutionId" in req.body)) queryField.push(`t2.t1_id=${req.body["institutionId"]}`);
        
        if (queryField.length>0) {
            queryField = " WHERE " + queryField.join("AND ");
        }
        else {
            queryField = "";
        }

        var queryInt = await db.performTransactionStep(dbo,
            `SELECT t2.id AS "userId", t2.name AS name, type, email, t2.t1_id AS "institutionId", t1.name AS "institutionName", `
            + `username FROM t2 INNER JOIN t3 ON t2.id=t3.t2_id INNER JOIN t1 ON t2.t1_id=t1.id`
            + `${queryField}`
            + `;`
        );
        return queryInt;
    });
    
    if (db.handleIfGeneralError(res,result)) return;
    
    res.status(200).json(result);
    return;
});

module.exports = router;