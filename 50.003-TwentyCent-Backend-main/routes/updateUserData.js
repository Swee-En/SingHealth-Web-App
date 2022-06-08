var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "userId": integer,
 *      "name" [optional]: (alphanumeric," ",",","-")-containing string,
 *      "email" [optional]: RFC5322-compliant email address string,
 *      "institutionId" [optional]: integer
 * }
 * Note that at least 1 of name, email or institutionId must be present
 * 
 * Returns:
 * - {"success": true} (200)
 * - {"error": "USER_NOT_FOUND"} (400)
 * - {"error": "INSTITUTION_NOT_FOUND"} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE TO ALL FOR SELF-UPDATE, BUT ONLY ADMINS CAN CHANGE OWN INSTITUION
 * ACCESSIBLE TO NON-TENANTS FOR UPDATING OTHERS' ACCOUNT WITH THESE RESTRICTIONS:
 * - ONLY ADMIN CAN CHANGE EMAILS FOR ALL
 * - ONLY ADMIN CAN CHANGE INSTITUTIONS FOR STAFF, AND ONLY ADMIN AND STAFF CAN CHANGE INSTITUTIONS FOR TENANTS
 */
router.post('/', async function(req,res) {
    // Check for request completeness
    if (!utils.checkRequestCompleteness(req,["sessionId","userId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if ((!("name" in req.body))&&(!("email" in req.body))&&(!("institutionId" in req.body))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!securityTools.checkInteger(req.body["userId"]))
        ||(("name" in req.body)&&(!securityTools.checkSanitizedPersonName(req.body["name"])))
        ||(("email" in req.body)&&(!securityTools.checkSanitizedEmail(req.body["email"])))
        ||(("institutionId" in req.body)&&(!securityTools.checkInteger(req.body["institutionId"])))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{

        var ownId = auth["id"];
        var ownType = auth["type"];

        var targetId = req.body["userId"];

        var queryInt = null;

        if (ownId!==targetId) {

            if (ownType===2) {
                return db.returnNotPermittedError();
            }

            if ((ownType===1)&&("email" in req.body)) return db.returnNotPermittedError();


            queryInt = await db.performTransactionStep(dbo,`SELECT id, type FROM t2 WHERE id=${targetId};`);
            if (queryInt.length===0) return {"error": "USER_NOT_FOUND"};

            if (ownType===1) {
                if (queryInt[0]["type"]!==2) return db.returnNotPermittedError();
            }
        }

        else {
            if ((ownType!==0)&&("institutionId" in req.body)) {
                return db.returnNotPermittedError();
            }
        }

        if ("institutionId" in req.body) {
            queryInt = await db.performTransactionStep(dbo,`SELECT id FROM t1 WHERE id=${req.body["institutionId"]};`);
            if (queryInt.length===0) return {"error": "INSTITUTION_NOT_FOUND"};
        }

        // Build custom query
        var updateFields = [];
            
        if ("name" in req.body) {
            updateFields.push(`name=\'${req.body["name"]}\'`);
        }
        if ("email" in req.body) {
            updateFields.push(`email=\'${req.body["email"]}\'`);
        }
        if ("institutionId" in req.body) {
            updateFields.push(`t1_id=${req.body["institutionId"]}`);
        }

        queryInt = await db.performTransactionStep(dbo,`UPDATE T2 SET ${updateFields.join(", ")} WHERE id=${targetId} RETURNING ID;`);
        if (queryInt.length===0) throw false;

        return {"success": true};
    });

    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
    
});

module.exports = router;