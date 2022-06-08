var express = require('express');
var db = require('../db/database');
var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

var router = express.Router();

/**
 * JSON format requirements:
 * {
 *      "sessionId": alphanumeric,
 *      "outletId": integer or null,
 *      "institutionId" [optional]: integer,
 *      "tenantId" [optional]: integer,
 *      "address" [optional]: (alphanumeric," ",",","-")-containing string,
 *      "checklist" [optional]: JS object containing string key-array of pair of string-integer value pairs,
 *      "validity_start" [optional]: "YYYY-MM-DD" string,
 *      "validity_end" [optional]: "YYYY-MM-DD" string
 * }
 * 
 * Note that at least 1 of the optional fields must be included
 * 
 * JS object format: [list of {"categoryName":categoryString,"questionList":[list of{"question":questionString,"maxScore":integer}]}]
 * Lists cannot be empty
 * 
 * Returns:
 * - {
 *      "institutionId": integer institutionId,
 *      "tenantId": integer tenantId,
 *      "address": string,
 *      "checklist": JS object,
 *      "validity_start": "YYYY-MM-DD" string or null,
 *      "validity_end": "YYYY-MM-DD" string or null
 *   } (200)
 * - {"error": "OUTLET_NOT_FOUND"} (400)
 * - {"detailError": array containing 1 or more of ["INSTITUTION_NOT_FOUND","TENANT_NOT_FOUND","INVALID_TENANT","INVALID_VALIDITY_PERIOD"]} (400)
 * - Default service error (500)
 * - Bad request error (400)
 * - Invalid session error (401)
 * - Not permitted error (401)
 * 
 * CAN ONLY BE INVOKED BY NON-TENANTS: ADMIN HAVE FULL PERMISSIONS, WHILE STAFF CANNOT CHANGE INSTITUTION
 * ADDITIONALLY, THESE CONSTRAINTS MUST BE FULFILLED:
 * - CHECKLIST JSON MUST BE NON-EMPTY
 * - VALIDITY START AND END MUST BE BOTH PRESENT OR ABSENT, AND END CANNOT BE EARLIER THAN START
 * - STAFF CANNOT CHANGE OUTLETS OUTSIDE THEIR INSTITUTION
 * - IF TENANT IS NULL, THEN VALIDITY DATES (IF ANY) WILL BE IGNORED
 * - ANY TENANT ASSIGNED MUST BE WITHIN TARGET INSTITUTION
 */
router.post('/',async function(req,res) {
    if (!utils.checkRequestCompleteness(req,["sessionId","outletId"])) {
        res.status(400).json(db.returnBadRequestError());
        return;
    }

    const fields = ["institutionId","tenantId","address","validity_start","validity_end"];
    for (var i=0;i<fields.length;i++) {
        if (fields[i] in req.body) {
            break;
        }
        if (i===fields.length-1) {
            res.status(400).json(db.returnBadRequestError());
            return;
        }
    }

    if ((("institutionId" in req.body)&&(!securityTools.checkInteger(req.body["institutionId"])))
        ||(("tenantId" in req.body)&&(req.body["tenantId"]!==null)&&(!securityTools.checkInteger(req.body["tenantId"])))
        ||(("address" in req.body)&&(!securityTools.checkSanitizedString(req.body["address"])))
        ||(("checklist" in req.body)&&((typeof req.body["checklist"]!=='object')||(req.body["checklist"]!==null)))
        ||(("validity_start" in req.body)&&((req.body["validity_start"]===null)||(!securityTools.checkSanitizedDate(req.body["validity_start"]))))
        ||(("validity_end" in req.body)&&((req.body["validity_end"]===null)||(!securityTools.checkSanitizedDate(req.body["validity_end"]))))) {
        res.status(400).json(db.returnBadRequestError());
        return;        
    }

    if ("checklist" in req.body) {
        if (!securityTools.checkChecklistFormat(req.body["checklist"],false)) {
            res.status(400).json(db.returnBadRequestError());
            return;
        }
    }

    var result = await db.makeTransaction(req,async (dbo,auth)=>{
        const ownType = auth["type"];
        const ownInstitution = auth["institution"];
        if (ownType===2) {
            return db.returnNotPermittedError();
        }
        if ((ownType===1)&&("institutionId" in req.body)) {
            return db.returnNotPermittedError();
        }

        var queryInt = await db.performTransactionStep(dbo,`SELECT * FROM t4 WHERE id=${req.body["outletId"]};`);
        if (queryInt.length===0) return {"error": "OUTLET_NOT_FOUND"};
        
        if ((ownType===1)&&(ownInstitution!==queryInt[0]["t1_id"])) return db.returnNotPermittedError();

        var errorStack = [];

        const originData = queryInt[0];

        const targetData = {
            "t1_id": originData["t1_1d"],
            "t2_id": originData["t2_id"],
            "address": "address" in req.body? req.body["address"]:originData["address"],
            "checklist": "checklist" in req.body? req.body["checklist"]:originData["checklist"],
            "validity_start": "validity_start" in req.body? req.body["validity_start"]:originData["validity_start"],
            "validity_end": "validity_end" in req.body? req.body["validity_end"]:originData["validity_end"]
        }

        if ("institutionId" in req.body) {
            queryInt = await db.performTransactionStep(dbo,`SELECT id FROM t4 WHERE id=${req.body["institutionId"]};`);
            if (queryInt.length===0) {
                errorStack.push("INSTITUTION_NOT_FOUND");
                targetData["t1_id"] = null;
            }
            else {
                targetData["t1_id"] = req.body["institutionId"];
            }
        }

        if ("tenantId" in req.body) {
            if (req.body["tenantId"]===null) {
                targetData["t2_id"] = null;
            }
            else {
                queryInt = await db.performTransactionStep(dbo,`SELECT id, t1_id FROM t2 WHERE id=${req.body["tenantId"]} AND type=2;`);

                if (queryInt.length===0) {
                    errorStack.push("TENANT_NOT_FOUND");
                    targetData["t2_id"] = null;
                }
                else {
                    if (targetData["t1_id"]!==null) {
                        if (queryInt[0]["t1_id"]!==targetData["t1_id"]) {
                            errorStack.push("INVALID_TENANT");
                            targetData["t2_id"] = null;
                        }
                    }
                }
            }
        }

        if (targetData["t2_id"]!==null) {
            if (typeof targetData["validity_start"]!==typeof targetData["validity_end"]) {
                errorStack.push("INVALID_VALIDITY_PERIOD");
            }
            else if ((targetData["validity_start"]!==null) && (utils.compareDateString(targetData["validity_start"],targetData["validity_end"])>1)) {
                errorStack.push("INVALID_VALIDITY_PERIOD");
            }
        }
        else {
            targetData["validity_start"] = null;
            targetData["validity_end"] = null;
        }

        if (errorStack.length>0) {
            return {"detailError": errorStack};
        }

        queryInt = await db.performTransactionStep(dbo,
            `UPDATE t4 SET `
            + `t1_id=${targetData["t1_id"]} `
            + `t2_id=${targetData["t2_id"]===null?"NULL":targetData["t2_id"]} `
            + `address=\'${targetData["address"]}\' `
            + `checklist=\'${JSON.stringify(targetData["checklist"])}\' `
            + `validity_start=${targetData["validity_start"]===null?"NULL":"\'" + targetData["validity_start"] + "\'"} `
            + `validity_end=${targetData["validity_end"]===null?"NULL":"\'" + targetData["validity_end"] + "\'"} `
            + `WHERE id=${req.body["outletId"]} RETURNING *;`
        );
        if (queryInt.length===0) throw false;
        queryInt[0]["validity_start"] = queryInt[0]["validity_start"]===null? null : utils.intToDateString(queryInt[0]["validity_start"].valueOf());
        queryInt[0]["validity_end"] = queryInt[0]["validity_end"]===null? null : utils.intToDateString(queryInt[0]["validity_end"].valueOf());
        return queryInt[0];
        

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