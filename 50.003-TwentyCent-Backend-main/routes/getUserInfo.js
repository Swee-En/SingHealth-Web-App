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
 * - {
 *      "userId": userId integer,
 *      "name": string,
 *      "type": integer,
 *      "email": string,
 *      "institutionId": institutionId integer,
 *      "username": string
 *   } (200)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * 
 * CAN BE INVOKED BY ALL
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
        var queryInt = await db.performTransactionStep(dbo,`SELECT t2.id AS "userId", name, type, email, t2.t1_id AS "institutionId", username FROM t2 INNER JOIN t3 ON t2.id=t3.t2_id WHERE t2.id=${auth["id"]};`);
        if (queryInt.length===0) throw false;
        return queryInt[0];
    });
    
    if (db.handleIfGeneralError(res,result)) return;

    res.status(200).json(result);
    return;

});
module.exports = router;