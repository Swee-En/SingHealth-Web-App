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
 * - [ list of {
 *      "institutionId": institutionId integer,
 *      "name": string,
 *      "address": string
 *   }] (200)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * 
 * CAN BE INVOKED BY ALL
 */
router.post('/', async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if (!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    
    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        var queryInt = await db.performTransactionStep(dbo,`SELECT id AS "institutionId", name, address FROM t1;`);
        return queryInt;
    });
    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;

});
module.exports = router;