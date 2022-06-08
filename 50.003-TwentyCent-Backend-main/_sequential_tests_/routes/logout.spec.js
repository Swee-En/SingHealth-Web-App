var RouteTestTemplate = require('../routeTestTemplate');
var db = require('../../db/database');

class LogoutSpec extends RouteTestTemplate {

    get path() {
        return "/logout";
    }

    getTestBody() {
        return [
            async ()=>{
                var response = await this.postAndGetResponse({});
                if (response.status!==400) return false;
                if (!this.matchObject(response["data"],db.returnBadRequestError())) return false;
                return true;
            },
            async ()=>{
                var response = await this.postAndGetResponse({
                    "sessionId": "rubbishSessionId"
                });
                if (response.status!==401) return false;
                if (!this.matchObject(response["data"],db.returnInvalidSessionError())) return false;
                return true;
            },
            async ()=>{
                var response = await this.postAndGetResponse({
                    "sessionId": "hashh"
                });
                if (response.status!==401) return false;
                if (!this.matchObject(response["data"],db.returnInvalidSessionError())) return false;
                return true;
            },
            async ()=>{
                var response = await this.postAndGetResponse({
                    "sessionId": "hash"
                });
                if (response.status!==200) return false;
                if (!this.matchObject(response["data"],{"success": true})) return false;

                var response1 = await this.makeQuery(`SELECT logout FROM t8 WHERE hash=\'hash\';`);
                if (response1.length===0) return false;
                if (response1[0]["logout"]===null) return false;
                if (Date.now()-response1[0]["logout"]<0) return false;
                return true;
            }
        ];
    }
}

var test = new LogoutSpec();
test.runTests();