var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "notificationIds": [list of notificationId integers]
 * }
 * notificationIds' array must be of length at least 1
 * 
 * Returns:
 * - {"updatedNotificationIds": [list of updated notifications' IDs]} (200)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * 
 * ACCESSIBLE TO ALL
 */
router.post('/',async function(req,res){
    if (!utils.checkRequestCompleteness(req,["sessionId","notificationIds"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(!(typeof req.body["notificationIds"]=='array'))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if (req.body["notificationIds"].length===0) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    for (var i in req.body["notificationIds"]) {
        if (!securityTools.checkInteger(req.body["notificationIds"][i])) {
            res.status(400).json(db.returnBadRequestError());
            return;
        }
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        var queryInt = await db.performTransactionStep(dbo,
            `UPDATE t7 SET seen=TRUE WHERE (NOT seen) AND t2_id_2=${auth.id} AND id IN ${"(" + req.body["notificationIds"].join(",") + ")" } RETURNING id;`
        );
        var ids = [];
        for (var i in queryInt) {
            ids.push(queryInt[i]["id"]);
        }
        return {"updatedNotificationIds": ids};
    });

    if (db.handleIfGeneralError(result));
    res.status(200).json(result);
    return;
});
module.exports = router;