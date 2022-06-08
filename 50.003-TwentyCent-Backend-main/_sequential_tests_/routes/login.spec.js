var RouteTestTemplate = require('../routeTestTemplate');
var crypto = require("crypto");
var db = require("../../db/database");

class LoginSpec extends RouteTestTemplate {

    get path() {
        return "/login";
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
                    "username": "admin_1",
                    "password": crypto.createHash('sha256').update("admin_1").digest('hex')
                });
                if (response["status"]!==200) return false;
                var response2 = await this.makeQuery(`SELECT t2_id, login FROM t8 WHERE hash=\'${response["data"]["sessionId"]}\';`);
                if (response2.length===0) return false;
                if (response2[0]["t2_id"]!==response["data"]["id"]) return false;
                if (Date.now()-response2[0]["login"]<0) return false;
                
                delete response["data"]["sessionId"];
                if (!this.matchObject(response["data"],{
                    "id": 1,
                    "name": "Admin 1",
                    "type": 0,
                    "email": "admin1@abc.com",
                    "institutionId": 1
                })) return false;

                
                return true;
            },
            async ()=>{
                var response = await this.postAndGetResponse({
                    "username": "admin_1",
                    "password": crypto.createHash('sha256').update("admin_2").digest('hex')
                });
                if (response["status"]!==401) return false;
                if (!this.matchObject(response["data"],{"error": "INVALID_CREDENTIALS"})) return false;
                return true;
            }
        ];
    }
}

var test = new LoginSpec();
test.runTests();

