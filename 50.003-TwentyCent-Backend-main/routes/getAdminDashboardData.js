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
 * Admin dashboard: only loads unread notifs to admin
 * 
 * Returns:
 * - {"notifications": [list of {
 *      "notificationId": notificationId integer,
 *      "senderId": senderId integer,
 *      "senderName": string,
 *      "message": string,
 *      "time": integer
 *   }]} (200)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE TO ADMINS ONLY
 */
router.post('/',async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if (!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{

        if (auth["type"]!==0) return db.returnNotPermittedError();

        var queryInt = await db.performTransactionStep(dbo,
            `SELECT t7.id AS "notificationId", t7.t2_id_1 AS "senderId", t2.name AS "senderName", t7.msg AS message, t7.time AS time `
            + `FROM t7 INNER JOIN t2 ON t7.t2_id_1=t2.id WHERE t7.t2_id_2=${auth["id"]} AND t7.seen=FALSE;`
        );

        for (var i in queryInt) {
            queryInt[i]["message"] = utils.atob(queryInt[i]["message"]);
        }
        return {"notifications": queryInt};
    });

    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;