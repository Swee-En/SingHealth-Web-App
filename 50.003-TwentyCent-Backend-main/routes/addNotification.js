var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "recipientId": integer,
 *      "message": raw string
 * }
 * 
 * Returns:
 * - {"notificationId": notificationId integer} (200)
 * - {"error": "USER_NOT_FOUND"} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * 
 * ACCESSIBLE TO ALL
 */
router.post('/',async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId","recipientId","message"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionid"]))
        ||(!securityTools.checkInteger(req.body["recipientId"]))
        ||(!(typeof req.body["message"]==='string'))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    req.body["message"] = btoa(req.body["message"]);

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        var queryInt = null;

        if (req.body["recipientId"]!==auth["id"]) {
            queryInt = await db.performTransactionStep(dbo,`SELECT id FROM t2 WHERE id=${req.body["recipientId"]};`);
            if (queryInt.length===0) return {"error": "USER_NOT_FOUND"};
        } 
        
        queryInt = await db.performTransactionStep(dbo,
            `INSERT INTO t7 (t2_id_1,t2_id_2,msg,time,seen) VALUES (${auth["id"]},${req.body["recipientId"]},\'${req.body["message"]}\',${utils.getCurrentTimestampInSeconds()},FALSE) RETURNING id;`
        );
        if (queryInt.length===0) throw false;
        return {"notificationId": queryInt[0]["id"]};
    });

    if (db.handleIfGeneralError(result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;