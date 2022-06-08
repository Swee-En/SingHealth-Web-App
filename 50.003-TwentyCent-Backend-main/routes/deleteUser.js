var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "userId": integer
 * }
 * 
 * Returns:
 * - {"success": true} (200)
 * - {"error": "USER_NOT_FOUND"} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * CAN ONLY BE INVOKED BY NON-TENANTS - STAFF CAN ONLY DELETE TENANTS
 */
router.post('/', async (req,res)=>{

    // Check request completeness
    if (!utils.checkRequestCompleteness(req,["sessionId","userId"])){ 
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        || (!securityTools.checkInteger(req.body["userId"]))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        var ownId = auth["id"];
        var ownType = auth["type"];

        var queryInt = await db.performTransactionStep(dbo,`SELECT t2.id AS id, t2.type AS type FROM t2 INNER JOIN t3 ON t2.id=t3.t2_id WHERE t2.id=\'${req.body["userId"]}\';`);
        if (queryInt.length===0) return {"error": "USER_NOT_FOUND"};

        switch (ownType) {
            case 1:
                if (queryInt[0]["type"]<=1) {
                    return db.returnNotPermittedError();
                }
                break;
            case 2:
                return db.returnNotPermittedError();
                break;
        }

        if (ownId===queryInt[0]["id"]) return db.returnNotPermittedError();

        queryInt = await db.performTransactionStep(dbo,`DELETE FROM t2 WHERE id=${queryInt[0]["id"]} RETURNING id;`);
        if (queryInt.length===0) throw false;

        return {"success": true};

    });
    
    if (db.handleIfGeneralError(res,result)) return;
    
    res.status(200).json(result);
    return;
});
module.exports = router;