var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "institutionId": integer,
 *      "name" [optional]: (alphanumeric," ",",","-")-containing string,
 *      "address" [optional]: (alphanumeric," ",",","-")-containing string
 * }
 * Note that at least 1 of name or address must be present
 * 
 * Returns:
 * - {"success": true} (200)
 * - {"error": "INSTITUTION_NOT_FOUND"} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * CAN ONLY BE INVOKED BY ADMINS
 */
router.post('/', async function(req,res) {
    // Check for request completeness
    if (!utils.checkRequestCompleteness(req,["sessionId","institutionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    
    if ((!("name" in req.body))&&(!("address" in req.body))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!securityTools.checkInteger(req.body["institutionId"]))
        ||(("name" in req.body)&&(!securityTools.checkSanitizedString(req.body["name"])))
        ||(("address" in req.body)&&(!securityTools.checkSanitizedString(req.body["address"])))) {
        res.status(400).json(db.returnBadRequestError());
        return;        
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        if (auth["type"]!==0) return db.returnNotPermittedError();

        var updateFields = [];
        if ("name" in req.body) {
            updateFields.push(`name=\'${req.body["name"]}\'`);
        }
        if ("address" in req.body) {
            updateFields.push(`address=\'${req.body["address"]}\'`);
        }

        var queryInt = db.performTransactionStep(dbo,`UPDATE t1 SET ${updateFields.join(", ")} WHERE id=${req.body["institutionId"]};`);
        if (queryInt.length===0) return {"error": "INSTITUTION_NOT_FOUND"};
        return {"success": true};
    });

    if (db.handleIfGeneralError(res,result)) return;

    res.status(200).json(result);
    return;
});

module.exports = router;