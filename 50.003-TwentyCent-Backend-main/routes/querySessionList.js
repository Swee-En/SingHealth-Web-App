var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "from" [optional]: time integer,
 *      "to" [optional]: time integer,
 *      "userId" [optional]: userId integer
 * }
 * At least 1 of the optional fields must be present
 * 
 * Returns:
 * - [ list of {
 *      "sessionId": sessionId int,
 *      "userId": userId int,
 *      "username": username string,
 *      "name": name string,
 *      "login": time int,
 *      "logout": time int or null
 *   }] (200)
 * - Default service error (500)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * CAN ONLY BE INVOKED BY ADMINS
 */
router.post('/',async function(req,res) {
    if (!utils.checkRequestCompleteness(req,["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!("from" in req.body))&&(!("to" in req.body))&&(!("userId" in req.body))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        ||(("from" in req.body)&&(!securityTools.checkInteger(req.body["from"])))
        ||(("to" in req.body)&&(!securityTools.checkInteger(req.body["to"])))
        ||(("userId" in req.body)&&(!securityTools.checkInteger(req.body["userId"])))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        if (auth["type"]!==0) return db.returnNotPermittedError();
        var queryFields = [];
        if ("from" in req.body) queryFields.push(`t8.login>=${req.body["from"]}`);
        if ("to" in req.body) queryFields.push(`t8.login<=${req.body["to"]}`);
        if ("userId" in req.body) queryFields.push(`t8.t2_id=${req.body["userId"]}`);
        queryFields = queryFields.join(" AND ");
        var queryInt = db.performTransactionStep(dbo,
            `SELECT t8.id AS "sessionId", t8.t2_id AS "userId", t3.username AS username, t2.name AS name, `
            + `t8.login AS login, t8.logout AS logout FROM t8 INNER JOIN t2 ON t8.t2_id=t2.id INNER JOIN `
            + `t3 ON t2.id=t3.t2_id WHERE ${queryFields};`
        );
        return queryInt;
    });

    if (db.handleIfGeneralError(result)) return;
    res.status(200).json(result);
    return;
});
module.exports = router;