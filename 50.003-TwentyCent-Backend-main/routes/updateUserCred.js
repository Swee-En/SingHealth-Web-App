var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "oldPassword" [conditionally optional]: SHA-256 alphanumeric hash
 *      "userId" [optional for admin]: integer,
 *      "username" [optional]: (alphanumeric+"_")-containing string,
 *      "newPassword" [optional]: SHA-256 alphanumeric hash,
 *      "type" [optional for admin]: type
 * }
 * 
 * At least 1 of username, newPassword and type must be present.
 * 
 * Returns:
 * - {"success": true} (200)
 * - {"error": "USER_NOT_FOUND"} (400)
 * - {"error": "DUPLICATE_USERNAME"} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE TO ALL
 * TENANTS AND STAFF CAN ONLY CHANGE OWN CREDENTIALS AND CANNOT USE USERID OR TYPE
 * ADMIN CAN USE ALL, BUT CANNOT CHANGE OWN TYPE
 * WHEN CHANGING OWN DETAILS, ALL MUST SPECIFY CURRENT PASSWORD
 */

router.post('/',async function (req,res){
    
    if (!utils.checkRequestCompleteness(req,"sessionId")) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if ((!("username" in req.body))&&(!("newPassword" in req.body))&&(!("type" in req.body))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(("oldPassword" in req.body) && (!securityTools.checkSanitizedAlphanumeric(req.body["oldPassword"])))
        ||(("userId" in req.body) && (!securityTools.checkInteger(req.body["userId"])))
        ||(("username" in req.body) && (!securityTools.checkSanitizedUsername(req.body["username"])))
        ||(("newPassword" in req.body) && (!securityTools.checkSanitizedAlphanumeric(req.body["newPassword"])))
        ||(("type" in req.body) && ((!securityTools.checkInteger(req.body["type"]))||([0,1,2].indexOf(req.body["type"])===-1)))) {
        res.status(400).json(db.returnBadRequestError());
        return;    
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        var ownAccount = true;
        if (auth["type"]!==0) {
            if ("userId" in req.body) {
                return db.returnNotPermittedError();
            }
        }
        else {
            if ("userId" in req.body) {
                if (req.body["userId"]!==auth["id"]) {
                    ownAccount = false;
                }
            }
        }
        if (ownAccount) {
            if ("type" in req.body) return db.returnNotPermittedError();
            if (!("oldPassword" in req.body)) return db.returnBadRequestError();

            var queryInt = await db.performTransactionStep(dbo,`SELECT id FROM t3 WHERE t2_id=${auth["id"]} AND pwd=\'${req.body["oldPassword"]}\';`);
            if (queryInt.length===0) return db.returnNotPermittedError;

            if ("username" in req.body) {
                queryInt = await db.performTransactionStep(dbo,`SELECT username FROM t3 WHERE username=\'${req.body["username"]}\';`);
                if (queryInt.length!==0) return {"error": "DUPLICATE_USERNAME"};
            }
            
            var updateFields = [];
            if ("username" in req.body) updateFields.push(`username=\'${req.body["username"]}\'`);
            if ("newPassword" in req.body) updateFields.push(`newPassword=\'${req.body["newPassword"]}\'`);
            updateFields = updateFields.join(", ");

            queryInt = await db.performTransactionStep(dbo,`UPDATE t3 SET ${updateFields} WHERE t2_id=${auth["id"]} RETURNING id;`);
            if (queryInt.length===0) throw false;
            return {"success": true};
        }
        else {
            var queryInt = db.performTransactionStep(dbo,`SELECT id FROM t3 WHERE id=${req.body["userId"]};`);
            if (queryInt.length===0) return {"error": "USER_NOT_FOUND"};
            
            if ("username" in req.body) {
                queryInt = await db.performTransactionStep(dbo,`SELECT username FROM t3 WHERE username=\'${req.body["username"]}\';`);
                if (queryInt.length!==0) return {"error": "DUPLICATE_USERNAME"};
            }

            if ("type" in req.body) {
                queryInt = await db.performTransactionStep(dbo,`UPDATE t2 SET type=${req.body["type"]} WHERE id=${req.body["userId"]} RETURNING id;`);
                if (queryInt.length===0) throw false;
            }
            if (("username" in req.body)||("newPassword" in req.body)) {
                var updateFields = [];
                if ("username" in req.body) updateFields.push(`username=\'${req.body["username"]}\'`);
                if ("newPassword" in req.body) updateFields.push(`newPassword=\'${req.body["newPassword"]}\'`);
                updateFields = updateFields.join(", ");

                queryInt = await db.performTransactionStep(dbo,`UPDATE t3 SET ${updateFields} WHERE t2_id=${req.body["userId"]} RETURNING id;`);
                if (queryInt.length===0) throw false;
            }

            return {"success": true};
        }
    });

    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;