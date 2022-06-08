var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "userIdList": [list of userId integers]
 * }
 * 
 * There must be at least 1 userId in the list.
 * 
 * Returns:
 * - [list of {
 *      "notificationId": notificationId integer,
 *      "senderId": senderId integer,
 *      "senderName": string,
 *      "recipientId": recipientId integer,
 *      "recipientName": string,
 *      "message": string,
 *      "time": integer,
 *      "seen": boolean
 *   }] (200)
 * - {"error": "USER_NOT_FOUND"}
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE TO ADMINS ONLY
 */
router.post('/',async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId","userIdList"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if (!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if (typeof req.body["userIdList"] !== 'array') {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    for (var i in req.body["userIdList"]) {
        if (!securityTools.checkInteger(req.body["userIdList"][i])) {
            res.status(400).json(db.returnBadRequestError());
            return;
        }
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{

        if (auth["type"]!==0) return db.returnNotPermittedError();

        var idList = "(" + req.body["userIdList"].join(",") + ")";

        var queryInt = await db.performTransactionStep(dbo,
            `SELECT id FROM t2 WHERE id IN ${idList};`
        );

        if (queryInt.length!==req.body["userIdList"].length) return {"error": "USER_NOT_FOUND"};

        queryInt = await db.performTransactionStep(dbo,
            `SELECT t7.id AS "notificationId", t7.t2_id_1 AS "senderId", t2a.name AS "senderName", `
            + `t7.t2_id_2 AS "recipientId", t2b.name AS "recipientName", t7.msg AS message, t7.time AS time, t7.seen AS seen FROM `
            + `t7 INNER JOIN t2 AS t2a ON t7.t2_id_1=t2a.id INNER JOIN t2 AS t2b ON t7.t2_id_2=t2b.id WHERE `
            + `t7.t2_id_1 IN ${idList} OR t7.t2_id_2 IN ${idList};`
        );
        for (var i in queryInt) {
            queryInt[i]["message"] = utils.atob(queryInt[i]["message"]);
        }
        return queryInt;
    });

    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;