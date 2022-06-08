var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "outletId": integer,
 *      "result": JS object
 * }
 * 
 * Tenant dashboard: only loads unread notifs, unresolved issues
 * 
 * Returns:
 * - {"auditId": auditId integer} (200)
 * - {"error": "OUTLET_NOT_FOUND"} (400)
 * - {"error": "OUTLET_UNOCCUPIED"} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE TO STAFF ONLY. STAFF CAN ONLY SUBMIT FOR OWN INSTITUTION
 */
router.post('/',async function (req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId","outletId","result"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!securityTools.checkInteger(req.body["outletId"]))
        ||(!securityTools.checkChecklistFormat(req.body["result"]))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req, (dbo,auth)=>{
        if (auth["type"]===1) return db.returnNotPermittedError();
        
        var queryInt = db.performTransactionStep(dbo,
            `SELECT t1_id, t2_id FROM t4 WHERE id=${req.body["outletId"]};`
        );
        if (queryInt.length===0) return {"error": "OUTLET_NOT_FOUND"};
        if (queryInt[0]["t2_id"]===null) return {"error": "OUTLET_UNOCCUPIED"};
        if (queryInt[0]["t1_id"]!==auth["institution"]) return db.returnNotPermittedError();

        queryInt = db.performTransactionStep(dbo,
            `INSERT INTO t5 (date,t2_id_1,t4_id,t2_id_2,result,resolved) VALUES (`
            + `${utils.intToDateString(Date.now())}, `
            + `${auth["id"]}, ${req.body["outletId"]}, ${queryInt[0]["t2_id"]}, `
            + `\'${JSON.stringify(req.body["result"])}\', TRUE) RETURNING id;`
        );
        if (queryInt.length===0) throw false;
        return {"auditId": queryInt[0]["id"]};
    });

    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;