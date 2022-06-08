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
 *  * Returns:
 * - {"success": true} (200)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * 
 * ACCESSIBLE FOR ALL
 */
router.post('/',async function(req,res) {
    // Check for completeness
    if (!utils.checkRequestCompleteness(req,["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if (!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    // Update session entry, where possible
    var query = null;
    try {
        query = await db.getDb().any(`UPDATE t8 SET logout=${utils.getCurrentTimestampInSeconds()} WHERE (hash=\'${req.body["sessionId"]}\' AND logout IS NULL) RETURNING id;`);
    }
    catch (err) {
        res.status(500).json(db.returnUnknownError());
        return;
    }

    // Check if user is already logged out
    if (query.length===0) {
        res.status(401).json(db.returnInvalidSessionError());
        return;
    }

    // Indicate if logout is successful otherwise
    res.status(200).json({"success": true});
    
});

module.exports = router;