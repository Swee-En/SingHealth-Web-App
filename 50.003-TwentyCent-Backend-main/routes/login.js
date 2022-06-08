var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');
var {createHash} = require('crypto');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "username": (alphanumeric+"_")-containing string,
 *      "password": alphanumeric SHA-256 hash string
 * }
 * 
 * Returns:
 * - {
 *      "sessionId": sessionId string,
 *      "id": integer userId,
 *      "name": name string,
 *      "type": integer (within [0,1,2] where 0 is admin, 1 is staff, 2 is tenant),
 *      "email": email string,
 *      "institutionId": integer institutionId
 *   } (200)
 * - {"error": "INVALID_CREDENTIALS"} (401)
 * - Default service error (500)
 * - Bad request error (400)
 * 
 * ACCESSIBLE FOR ALL
 */
router.post('/',async function(req,res) {

    // Check for completeness
    if (!utils.checkRequestCompleteness(req,["username","password"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    
    // Extract submitted credentials
    const username = req.body["username"];
    const password = req.body["password"];
    
    // Check that username and password are proper
    if ((!(securityTools.checkSanitizedUsername(username)))||(!(securityTools.checkSanitizedAlphanumeric(password)))) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    
    var query = null;

    // Perform transaction
    try {
        query = await db.getDb().tx(async (dbo) => {
            var queryInt = null;

            // Check credentials
            try {
                queryInt = await dbo.any(`SELECT t2_id FROM t3 WHERE username=\'${username}\' AND pwd=\'${password}\';`);
            }
            catch(err) {
                return db.returnUnknownError();
            }

            // Check if credentials are invalid
            if (queryInt.length===0) {
                return {"error": "INVALID_CREDENTIALS"};
            }

            var id = queryInt[0]["t2_id"];

            // Insert session
            try {
                queryInt = await dbo.any(`INSERT INTO t8 (t2_id,login) VALUES (${id},${utils.getCurrentTimestampInSeconds()}) RETURNING id;`);
            }
            
            // Check for errors
            catch(err) {
                return db.returnUnknownError();
            }
            if (queryInt.length==0) {
                return db.returnUnknownError();
            }

            // Insert hash
            const hash = createHash('sha256');
            hash.update(queryInt[0]["id"]+"");
            const sessHash = hash.copy().digest('hex');

            try {
                queryInt = await dbo.any(`UPDATE t8 SET hash=\'${sessHash}\' WHERE id=${queryInt[0]["id"]} RETURNING hash;`);
            }
            catch (err) {
                throw "T8 insertion failed";
            }
            if (queryInt.length===0) {
                throw "T8 insertion failed";
            }

            var sessionId = queryInt[0]["hash"];

            try {
                queryInt = await dbo.any(`SELECT id, name, type, email, t1_id as \"institutionId\" FROM t2 WHERE id=${id};`);
            }
            catch (err) {
                throw "T2 retrieval failed";
            }
            if (queryInt.length===0) {
                throw "T2 retrieval failed";
            }
            var returnData = queryInt[0];
            returnData["sessionId"] = sessionId;
            return returnData;
        });
    }
    catch(err) {
        res.status(500).json(db.returnUnknownError());
        return;
    }

    // Check if auth is unsuccessful

    if (db.handleIfDefaultError(res,query)) return;

    if ("error" in query) {
        res.status(401).json(query);
        return;
    }
    
    res.status(200).json(query);
    return;
});

module.exports = router;