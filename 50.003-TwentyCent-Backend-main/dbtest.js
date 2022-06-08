var http = require("https");
var crypto = require('crypto');

class LeaderboardUtils {
    static get hostname() {
        return "localhost";
    }

    static get port() {
        return 3000;
    }

    static postJson(path, json, completeCallback, errorCallback) {
        var req = http.request(
            {
                hostname: LeaderboardUtils.hostname,
                port: LeaderboardUtils.port,
                path: path,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            },
            (res) => {
                var data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    completeCallback(data);
                });
            }
        );

        req.on("error", (err) => {
            errorCallback(err);
        });
        req.write(json);
        req.end();
    }
}

var db = require('./db/database');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

LeaderboardUtils.postJson("/login",JSON.stringify({
    username: "admin",
    password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"
}),(data)=>console.log(data),(err)=>console.log(err));

/*console.log(utils.getCurrentTimestamp());*/


/*LeaderboardUtils.postJson("/logout",JSON.stringify({
    sessionId: "b7a56873cd771f2c446d369b649430b65a756ba278ff97ec81bb6f55b2e73569"
}),(data)=>console.log(data),(err)=>console.log(err));*/



/*db.initializeDb('postgres','postgres','localhost',5432,'main_test');

var test = null;

db.getDb().any('SELECT * FROM temp;').then((data)=>{
    console.log(data[0]["a"].constructor.name);
})*/

//console.log(crypto.createHash('sha256').update("naffins").digest('hex'));

/*LeaderboardUtils.postJson("/addUser",JSON.stringify({
    "sessionId": "c2356069e9d1e79ca924378153cfbbfb4d4416b1f99d41a2940bfdb66c5319db",
    "name": "naffinsaaa",
    "type": 0,
    "email": "naffins@abc.net",
    "institutionId": 1,
    "username": "shiena",
    "password": crypto.createHash('sha256').update("naffins").digest('hex')
}),(data)=>console.log(data),(err)=>console.log(err));*/

/*LeaderboardUtils.postJson("/deleteUser",JSON.stringify({
    "sessionId": "c2356069e9d1e79ca924378153cfbbfb4d4416b1f99d41a2940bfdb66c5319db",
    "userId": 6
}),(data)=>console.log(data),(err)=>console.log(err));*/

LeaderboardUtils.postJson("/updateUserData",JSON.stringify({
    "sessionId": "5f9c4ab08cac7457e9111a30e4664920607ea2c115a1433d7be98e97e64244ca",
    "userId": 9,
    "email": "user@abc.net",
    "institutionId": 2
}),(data)=>console.log(data),(err)=>console.log(err));


