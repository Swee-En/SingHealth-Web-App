var pgp = require('pg-promise')();

var securityTools = require('../security/securityTools');
var utils = require('../utils/utils');

class Db {
    
    static initializeDb(username,password,host,port,database) {
        Db.db = pgp('postgres://'+username+':'+password+'@'+host+':'+port+'/'+database);
    }

    static getDb() {
        if (Db.db === undefined) throw "DB not initialized";
        return Db.db;
    }

    static returnUnknownError() {
        return {"error": "SERVICE_TEMPORARILY_UNAVAILABLE"};
    }

    static checkUnknownError(obj) {
        if (obj===null) return false;
        if (typeof obj!=='object') return false;
        return (("error" in obj) && (obj["error"]===Db.returnUnknownError()["error"]));
    }

    static returnInvalidSessionError() {
        return {"error": "INVALID_SESSION"};
    }

    static checkInvalidSessionError(obj) {
        if (obj===null) return false;
        if (typeof obj!=='object') return false;
        return (("error" in obj) && (obj["error"]===Db.returnInvalidSessionError()["error"]));
    }

    static returnBadRequestError() {
        return {"error": "BAD_REQUEST"};
    }

    static checkBadRequestError(obj) {
        if (obj===null) return false;
        if (typeof obj!=='object') return false;
        return (("error" in obj) && (obj["error"]===Db.returnBadRequestError()["error"]));
    }

    static returnNotPermittedError() {
        return {"error": "NOT_PERMITTED"};
    }

    static checkNotPermittedError(obj) {
        if (obj===null) return false;
        if (typeof obj!=='object') return false;
        return (("error" in obj) && (obj["error"]===Db.returnNotPermittedError()["error"]));
    }

    static checkAndEnforceSessionExpiry(sessionId,login,dbo) {
        if (utils.getCurrentTimestampInSeconds()-login > securityTools.getSessionTimeout()) {
            dbo.any(`UPDATE t8 SET logout=${utils.getCurrentTimestampInSeconds()} WHERE id=\'${sessionId}\';`)
            .catch((err)=>{});
            return false;
        }
        return true;
    }

    static async checkSessionValidityAndGetDetails(sessionId,dbo) {
        var query = null;
        try {
            query = await dbo.any(
                'SELECT t2.type AS type, t2.id AS id, t1_id AS institution '
                + 'FROM t2 INNER JOIN t8 ON t2.id=t8.t2_id '
                + `WHERE (t8.hash=\'${sessionId}\' AND t8.logout IS NULL AND t8.login>=${utils.getCurrentTimestampInSeconds()-securityTools.getSessionTimeout()});`
            );
        }
        catch (err) {
            return null;
        }
        if (query.length===0) {
            return false;
        }
        return query[0];
    }

    static async makeTransaction(req,mainCallback) {
        try {
            return await Db.db.tx( async (dbo)=>{
                var auth = await Db.checkSessionValidityAndGetDetails(req.body["sessionId"],dbo);
                if (auth===null) throw false;
                if (!auth) {
                    return Db.returnInvalidSessionError();
                }
                return await mainCallback(dbo,auth);
            });
        }
        catch (err) {
            console.log(err);
            return Db.returnUnknownError();
        }
    }

    static async performTransactionStep(dbo,query) {
        return await dbo.any(query);
    }

    static handleIfDefaultError(res,result) {
        if (result===null) return false;
        if (typeof result!=="object") return false;

        if (!("error" in result)) return false;
        if (Db.checkUnknownError(result)) {
            res.status(500).json(result);
            return true;
        }
        if (Db.checkBadRequestError(result)) {
            res.status(400).json(result);
            return true;
        }
        
        if ((Db.checkNotPermittedError(result))||(Db.checkInvalidSessionError(result))) {
            res.status(401).json(result);
            return true;
        }
        return false;

    }

    static handleIfGeneralError(res,result) {
        if (result===null) return false;
        if (typeof result!=="object") return false;

        if (Db.handleIfDefaultError(res,result)) return true;
        if ("error" in result) {
            res.status(400).json(result);
            return true;
        }
        return false;
    }
}

module.exports = Db;