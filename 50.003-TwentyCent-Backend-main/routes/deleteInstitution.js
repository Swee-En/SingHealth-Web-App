var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "institutionId": integer
 * }
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
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!securityTools.checkInteger(req.body["institutionId"]))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    
    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        if ((auth["type"]!==0)||(auth["institution"]===req.body["institutionId"])) return db.returnNotPermittedError();

        var queryInt = await db.performTransactionStep(dbo,`SELECT id FROM t1 WHERE id=${req.body["institutionId"]};`);
        if (queryInt.length===0) return {"error": "INSTITUTION_NOT_FOUND"};

        queryInt = await db.performTransactionStep(dbo,`DELETE FROM t1 WHERE id=${req.body["institutionId"]} RETURNING id;`);
        if (queryInt.length===0) throw false;
        return {"success": "false"};
    })

    if (db.handleIfGeneralError(res,result)) return;
    
    res.status(200).json(result);
    return;

});

module.exports = router;