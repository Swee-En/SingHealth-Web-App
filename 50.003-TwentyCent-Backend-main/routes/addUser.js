var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "name": (alphanumeric+" ")-containing string,
 *      "type": integer, {0: admin, 1: staff, 2: tenant},
 *      "email": RFC5322-compliant email address string,
 *      "institutionId": integer,
 *      "username": UNIQUE (alphanumeric+"_")-containing string,
 *      "password": alphanumeric SHA-256 hash string
 * }
 * 
 * Returns:
 * - {"userId": integer userId} (200)
 * - {"detailError": array containing 1 or more of ["INSTITUTION_NOT_FOUND","DUPLICATE_USERNAME"]} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * CAN ONLY BE INVOKED BY NON-TENANTS - STAFF CAN ONLY CREATE TENANT ACCOUNTS
 */
router.post('/',async function(req,res) {

    // Check for router completeness
    if (!utils.checkRequestCompleteness(req,["sessionId","name","type","email","institutionId","username","password"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }
    if ((!securityTools.checkSanitizedAlphanumeric(req.body["sessionId"]))
        || (!securityTools.checkSanitizedPersonName(req.body["name"]))
        || (!securityTools.checkInteger(req.body["type"]))
        || ([0,1,2].indexOf(req.body["type"])===-1)
        || (!securityTools.checkSanitizedEmail(req.body["email"]))
        || (!securityTools.checkInteger(req.body["institutionId"]))
        || (!securityTools.checkSanitizedUsername(req.body["username"]))
        || (!securityTools.checkSanitizedAlphanumeric(req.body["password"]))) {
        
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    // Perform queries
    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        switch (auth["type"]) {
            case 1:
                if (req.body["type"]<=1) {
                    return db.returnNotPermittedError();
                }
                break;
            case 2:
                return db.returnNotPermittedError();
                break;
        }

        // Check institution ID validity
        var errorStack = [];
        var queryInt = await db.performTransactionStep(dbo,`SELECT id FROM t1 WHERE id=${req.body["institutionId"]};`);
        if (queryInt.length===0) errorStack.push("INSTITUTION_NOT_FOUND");
        

        // Check for duplicate username
        queryInt = await db.performTransactionStep(dbo,`SELECT id FROM t3 WHERE username=\'${req.body["username"]}\';`);
        if (queryInt.length!==0) errorStack.push("DUPLICATE_USERNAME");
        
        if (errorStack.length>0) {
            return {"detailError": errorStack};
        }

        queryInt = await db.performTransactionStep(dbo,
            'INSERT INTO t2 (name,type,email,t1_id) VALUES '
            + `(\'${req.body["name"]}\',${req.body["isAdmin"]?0:1},\'${req.body["email"]}\',${req.body["institutionId"]}) `
            + 'RETURNING id;'
        );
        if (queryInt.length===0) throw false;


        // Next, to t3
        var queryInt1 = null;
        queryInt1 = await db.performTransactionStep(dbo,
            'INSERT INTO t3 (t2_id,username,pwd) VALUES '
            + `(${queryInt[0]["id"]},\'${req.body["username"]}\',\'${req.body["password"]}\') RETURNING id;`
        );

        if (queryInt1.length===0) throw false;
        return {"userId": queryInt[0]["id"]};

    });

    if (db.handleIfGeneralError(res,result)) return;

    if ("detailError" in result) {
        res.status(400).json(result);
        return;
    }
    
    res.status(200).json(result);
    return;

});

module.exports = router;