var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "issueId": integer,
 *      "description" [optional]: string,
 *      "deadline" [optional]: YYYY-MM-DD string,
 *      "resolved" [optional]: boolean
 * }
 * 
 * At least 1 of the optional fields must be present
 * 
 * For updating issues. Audits will be set to resolved/not-resolved if resolved field is present
 * 
 * Returns:
 * - {"auditId": integer, "auditResolved": boolean} (200)
 * - {"error": "AUDIT_NOT_FOUND"} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE TO STAFF ONLY. STAFF CAN ONLY MODIFY FOR OWN INSTITUTION
 */
router.post('/', async function(req,res){

    if (!utils.checkRequestCompleteness(req,["sessionId","issueId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if ((!("description" in req.body))&&(!("deadline" in req.body))&&(!("resolved" in req.body))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!securityTools.checkInteger(req.body["issueId"]))
        ||(("description" in req.body)&&(typeof req.body["description"]!=="string"))
        ||(("deadline" in req.body)&&(!securityTools.checkSanitizedDate(req.body["deadline"])))
        ||(("resolved" in req.body)&&(typeof req.body["resolved"]!=='boolean'))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        if (auth["type"]!==1) return db.returnNotPermittedError();
        
        var queryInt = db.performTransactionStep(dbo,
            `SELECT t4.t1_id AS "institutionId" FROM t6 INNER JOIN t5 ON t6.t5_id=t5.id INNER JOIN t4 ON t5.t4_id=t4.id `
            + `WHERE t6.id=${req.body["issueId"]};`
        );
        if (queryInt.length===0) return {"error": "AUDIT_NOT_FOUND"};
        if (queryInt[0]["institutionId"]!==auth["institution"]) return db.returnNotPermittedError();

        var updateFields = [];
        if ("description" in req.body) updateFields.push(`descr=\'${btoa(req.body["description"])}\'`);
        if ("deadline" in req.body) updateFields.push(`dl=\'${req.body["deadline"]}\'`);
        if ("resolved" in req.body) updateFields.push(`resolved=${req.body["resolved"]?"TRUE":"FALSE"}`);
        updateFields = updateFields.join(", ");
        
        queryInt = db.performTransactionStep(dbo,
            `UPDATE t6 SET ${updateFields} WHERE id=${issueId} RETURNING id, t5_id;`
        );
        if (queryInt.length===0) throw false;

        var auditId = queryInt[0]["t5_id"];
        
        var auditResolved = false;
        if ("resolved" in req.body) {
            if (req.body["resolved"]) {
                
                queryInt = db.performTransactionStep(dbo,
                    `SELECT id FROM t6 WHERE t5_id=${auditId} AND resolved=FALSE;`
                );
                if (queryInt.length===0) {
                    auditResolved = true;
                    queryInt = db.performTransactionStep(dbo,
                        `UPDATE t5 SET resolved=TRUE WHERE id=${auditId} RETURNING ID;`
                    );
                    if (queryInt.length===0) throw false;
                }
            }
            else {
                queryInt = db.performTransactionStep(dbo,
                    `UPDATE t5 SET resolved=FALSE WHERE id=${auditId} RETURNING id;`
                );
                if (queryInt.length===0) throw false;
            }
        }
        else {
            queryInt = db.performTransactionStep(dbo,`SELECT resolved FROM t5 where id=${auditId};`);
            if (queryInt.length===0) throw false;
            auditResolved = queryInt[0]["resolved"];
        }

        return {"auditId": auditId, "auditResolved": auditResolved};
        
    });
    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;

});
module.exports = router;