var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "name": (alphanumeric," ",",","-")-containing string,
 *      "address": (alphanumeric," ",",","-")-containing string
 * }
 * 
 * Returns:
 * - {"institutionId": integer institutionId} (200)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * CAN ONLY BE INVOKED BY ADMINS
 */
router.post('/', async function(req,res) {
    // Check for request completeness
    if (!utils.checkRequestCompleteness(req,["sessionId","name","address"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!securityTools.checkSanitizedString(req.body["name"]))
        ||(!securityTools.checkSanitizedString(req.body["address"]))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        if (auth["type"]!==0) {
            return db.returnNotPermittedError();
        }

        var queryInt = await db.performTransactionStep(dbo,`INSERT INTO t1 (name,address) VALUES (\'${req.body["name"]}\',\'${req.body["address"]}\') RETURNING id`);
        if (queryInt.length===0) throw false;
        return {"institutionId": queryInt[0]["id"]};
    });

    if (db.handleIfGeneralError(res,result)) return;

    res.status(200).json(query);
    return;
});

module.exports = router;