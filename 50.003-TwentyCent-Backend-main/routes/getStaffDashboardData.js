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
 * Staff dashboard: loads unread notifs, occupied outlets list and unresolved issues for audits done by staff
 * 
 * Returns:
 * - {
 *      "notifications": {
 *          "notificationId": notificationId integer,
 *          "senderId": senderId integer,
 *          "senderName": string,
 *          "message": string,
 *          "time": integer
 *      },
 *      "outlets": {
 *          "outletId": outletId integer,
 *          "tenantId": tenantId integer,
 *          "tenantName": string,
 *          "outletAddress": string,
 *          "validity_start": YYYY-MM-DD string,
 *          "validity_end": YYYY-MM-DD string
 *      },
 *      "issues": {
 *          "issueId": issueId integer,
 *          "auditId": auditId integer,
 *          "tenantId": tenantId integer,
 *          "tenantName": string,
 *          "outletId": outletId integer,
 *          "outletAddress": string,
 *          "description": string,
 *          "deadline": YYYY-MM-DD string 
 *      }
 *   } (200)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * ACCESSIBLE TO TENANTS
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

    var result = await db.makeTransaction(req, async (dbo,auth)=>{

        if (auth["type"]!==1) return db.returnNotPermittedError();

        var notifications = await db.performTransactionStep(dbo,
            `SELECT t7.id AS "notificationId", t7.t2_id_1 AS "senderId", t2.name AS "senderName", t7.msg AS message, t7.time AS time `
            + `FROM t7 INNER JOIN t2 ON t7.t2_id_1=t2.id WHERE t7.t2_id_2=${auth["id"]} AND t7.seen=FALSE;`
        );

        for (var i in notifications) {
            notifications[i]["message"] = utils.atob(notifications[i]["message"]);
        }

        var outlets = await db.performTransactionStep(dbo,
            `SELECT t4.id AS "outletId", t2.id AS "tenantId", t2.name AS "tenantName", t4.address AS "outletAddress", t4.validity_start AS "validity_start", `
            + `t4.validity_end AS "validity_end" FROM t2 INNER JOIN t4 ON t2.id=t4.t2_id WHERE t4.t1_id=${auth["institution"]};`
        );
        for (var i in outlets) {
            outlets[i]["validity_start"] = utils.intToDateString(outlets[i]["validity_start"].valueOf());
            outlets[i]["validity_end"] = utils.intToDateString(outlets[i]["validity_end"].valueOf());
        }

        var issues = await db.performTransactionStep(dbo,
            `SELECT t6.id AS "issueId", t6.t5_id AS "auditId", t2.id AS "tenantId", t2.name AS "tenantName", `
            + `t4.id AS "outletId", t4.address AS "outletAddress", t6.descr AS description, `
            + `t6.dl AS deadline FROM t6 INNER JOIN t5 ON t6.t5_id = t5.id INNER JOIN t4 ON t5.t4_id=t4.id `
            + `INNER JOIN t2 ON t5.t2_id_1=t2.id `
            + `WHERE t5.t2_id_1=${auth["id"]} AND t5.resolved=FALSE;`  
        );
        
        for (var i in issues) {
            issues[i]["description"] = utils.atob(issues[i]["description"]);
            issues[i]["deadline"] = utils.intToDateString(issues[i]["deadline"].valueOf());
        } 

        return {"notifications": notifications, "outlets": outlets, "issues": issues};
    });

    if (db.handleIfGeneralError(res,result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;