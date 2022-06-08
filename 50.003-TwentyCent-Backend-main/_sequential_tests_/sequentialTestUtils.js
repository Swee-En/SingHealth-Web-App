const https = require("https");
const db = require("../db/database");
const crypto = require("crypto");

class SequentialTestUtils {
    
    static get apiHostname() {
        return "localhost";
    }

    static get apiPort() {
        return 3000;
    }

    static get dbUsername() {
        return "postgres";
    }

    static get dbPassword() {
        return "postgres";
    }

    static get dbHostname() {
        return "localhost";
    }

    static get dbPort() {
        return 5432;
    }

    static get dbDatabase() {
        return "testing_database";
    }

    static postAndGetJson(path, jsObj, completeCallback, errorCallback) {
        var req = https.request(
            {
                hostname: SequentialTestUtils.apiHostname,
                port: SequentialTestUtils.apiPort,
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
                    completeCallback(JSON.parse(data));
                });
            }
        );

        req.on("error", (err) => {
            errorCallback(err);
        });
        req.write(JSON.stringify(jsObj));
        req.end();
    }

    static initializeDatabase() {
        db.initializeDb(
            SequentialTestUtils.dbUsername,
            SequentialTestUtils.dbPassword,
            SequentialTestUtils.dbHostname,
            SequentialTestUtils.dbPort,
            SequentialTestUtils.dbDatabase
        );
    }

    static get createTableCommands() {
        return [
            "CREATE TABLE IF NOT EXISTS t1 ("
            + "id serial PRIMARY KEY, "
            + "name text NOT NULL, "
            + "address text NOT NULL"
            + ");",
            "CREATE TABLE IF NOT EXISTS t2 ("
            + "id serial PRIMARY KEY, "
            + "name text NOT NULL, "
            + "type int NOT NULL CHECK (type in (0,1,2)), "
            + "email text NOT NULL, "
            + "t1_id int NOT NULL REFERENCES t1(id) ON DELETE CASCADE"
            + ");",
            "CREATE TABLE IF NOT EXISTS t3 ("
            + "id serial PRIMARY KEY, "
            + "t2_id int NOT NULL REFERENCES t2(id) ON DELETE CASCADE, "
            + "username text UNIQUE NOT NULL, "
            + "pwd text NOT NULL"
            + ");",
            "CREATE TABLE IF NOT EXISTS t4 ("
            + "id serial PRIMARY KEY, "
            + "t1_id int NOT NULL REFERENCES t1(id) ON DELETE CASCADE, "
            + "t2_id int REFERENCES t2(id) ON DELETE SET NULL, "
            + "address text NOT NULL, "
            + "checklist json NOT NULL, "
            + "validity_start date, "
            + "validity_end date"
            + ");",
            "CREATE TABLE IF NOT EXISTS t5 ("
            + "id serial PRIMARY KEY, "
            + "date date NOT NULL, "
            + "t2_id_1 int NOT NULL REFERENCES t2(id) ON DELETE CASCADE, "
            + "t4_id int NOT NULL REFERENCES t4(id) ON DELETE CASCADE, "
            + "t2_id_2 int NOT NULL REFERENCES t2(id) ON DELETE CASCADE, "
            + "result json NOT NULL, "
            + "resolved boolean NOT NULL"
            + ");",
            "CREATE TABLE IF NOT EXISTS t6 ("
            + "id serial PRIMARY KEY, "
            + "t5_id int NOT NULL REFERENCES t5(id) ON DELETE CASCADE, "
            + "descr text NOT NULL, "
            + "dl date NOT NULL, "
            + "resolved boolean NOT NULL"
            + ");",
            "CREATE TABLE IF NOT EXISTS t7 ("
            + "id serial PRIMARY KEY, "
            + "t2_id_1 int NOT NULL REFERENCES t2(id) ON DELETE CASCADE, "
            + "t2_id_2 int NOT NULL REFERENCES t2(id) ON DELETE CASCADE, "
            + "msg text NOT NULL, "
            + "time int NOT NULL, "
            + "seen boolean NOT NULL"
            + ");",
            "CREATE TABLE IF NOT EXISTS t8 ("
            + "id serial PRIMARY KEY, "
            + "t2_id int NOT NULL REFERENCES t2(id) ON DELETE CASCADE, "
            + "login int NOT NULL, "
            + "logout int, "
            + "hash text"
            + ");",
            "CREATE TABLE IF NOT EXISTS t9 ("
            + "id serial PRIMARY KEY, "
            + "t6_id int NOT NULL REFERENCES t6(id) ON DELETE CASCADE, "
            + "t2_id int NOT NULL REFERENCES t2(id) ON DELETE CASCADE, "
            + "msg text NOT NULL, "
            + "atch text, "
            + "time int NOT NULL"
            + ");"
        ];
    }

    static get initialTestingData() {
        return [
            [
                'Institution 1',
                'Institution 2',
                'Institution 3',
                'Institution 4',
                'Institution 5'
            ],
            [
                ['Admin 1',0,'admin1@abc.com',1],
                ['Admin 2',0,'admin2@abc.com',3],
                ['Admin 3',0,'admin3@abc.com',5],
                ['Admin 4',0,'admin4@abc.com',2],
                ['Staff 1',1,'staff1@abc.com',4],
                ['Staff 2',1,'staff2@abc.com',3],
                ['Staff 3',1,'staff3@abc.com',5],
                ['Staff 4',1,'staff4@abc.com',2],
                ['Tenant 1',2,'tenant1@abc.com',1],
                ['Tenant 2',2,'tenant2@abc.com',5],
                ['Tenant 3',2,'tenant3@abc.com',5],
                ['Tenant 4',2,'tenant4@abc.com',1]
            ],
            [
                'admin_1',
                'admin_2',
                'admin_3',
                'admin_4',
                'staff_1',
                'staff_2',
                'staff_3',
                'staff_4',
                'tenant_1',
                'tenant_2',
                'tenant_3',
                'tenant_4'
            ],
            [
                [1,null,[
                    {
                        "categoryName": "catA",
                        "questionList": [
                            {"question": "Question A1", "maxScore": 2},
                            {"question": "Question A2", "maxScore": 5},
                            {"question": "Question A3", "maxScore": 3}
                        ]
                    },
                    {
                        "categoryName": "catB",
                        "questionList": [
                            {"question": "Question B1", "maxScore": 12},
                            {"question": "Question B2", "maxScore": 15},
                            {"question": "Question B3", "maxScore": 13}
                        ]
                    }
                ],'2021-01-01','2021-12-12'],
                [2,10,[
                    {
                        "categoryName": "catA",
                        "questionList": [
                            {"question": "Question A1", "maxScore": 1}
                        ]
                    }
                ],'2019-01-01','2019-01-02'],
                [3,12,[
                    {
                        "categoryName": "catA",
                        "questionList": [
                            {"question": "Question A1", "maxScore": 1}
                        ]
                    }
                ],'2021-01-01','2021-12-31'],
                [5,null,[],null,null]
            ],
            [
                ["2020-05-05",1,1,2,[],true],
                ["2020-05-06",1,1,2,[
                    {
                        "categoryName": "catA",
                        "questionList": [
                            {"question": "Question A1", "maxScore": 1, "actualScore": 0}
                        ]
                    }
                ],false]
            ],
            [
                [1,"Test","2020-05-05",true],
                [2,"Test","2020-05-06",false]
            ],
            [
                [1,2,"test_msg",100,true]
            ],
            [
                [1,1231,1231,"hashh"],
                [1,123123,null,"hash"]
            ],
            [
                [1,1,"smth","smth",20],
                [1,1,"smth",null,2000]
            ]
        ];
    }

    static getLoadTableQuery(tableIndex) {
        if (!Number.isInteger(tableIndex)) throw "SequentialTestUtils: getLoadTableQuery(): invalid input";
        if (tableIndex<=0||tableIndex>=10) throw "SequentialTestUtils: getLoadTableQuery(): invalid input";
        var table = SequentialTestUtils.initialTestingData[tableIndex-1];
        if (table.length===0) return ";";

        var query = `INSERT INTO t${tableIndex} `;

        switch(tableIndex) {
            case 1:
                query += `(name,address) VALUES `;
                for (var i=0;i<table.length;i++) {
                    query += `(\'${table[i]}\',\'${"Address " + (i+1)}\')`;
                    if (i!==table.length-1) query += ", ";
                }
                break;
            case 2:
                query += `(name,type,email,t1_id) VALUES `;
                for (var i=0;i<table.length;i++) {
                    query += `(\'${table[i][0]}\',${table[i][1]},\'${table[i][2]}\',${table[i][3]})`;
                    if (i!==table.length-1) query += ", ";
                }
                break;
            case 3:
                query += `(t2_id,username,pwd) VALUES `;
                for (var i=0;i<table.length;i++) {
                    const pwdHash = crypto.createHash('sha256').update(table[i]).digest('hex');
                    query += `(${i+1},\'${table[i]}\',\'${pwdHash}\')`;
                    if (i!==table.length-1) query += ", ";
                }
                break;
            case 4:
                query += `(t1_id,t2_id,address,checklist,validity_start,validity_end) VALUES `;
                for (var i=0;i<table.length;i++) {
                    query += `(${table[i][0]},${table[i][1]},\'Outlet ${i+1} Address\',\'${JSON.stringify(table[i][2])}\',`
                    query += `${table[i][3]===null?"NULL":"\'"+table[i][3]+"\'"},`;
                    query += `${table[i][4]===null?"NULL":"\'"+table[i][4]+"\'"})`;
                    if (i!==table.length-1) query += ", ";
                }
                break;
            case 5:
                query += `(date,t2_id_1,t4_id,t2_id_2,result,resolved) VALUES `;
                for (var i=0;i<table.length;i++) {
                    query += `(\'${table[i][0]}\',${table[i][1]},${table[i][2]},${table[i][3]},`;
                    query += `\'${JSON.stringify(table[i][4])}\',${table[i][5]?"TRUE":"FALSE"})`;
                    if (i!==table.length-1) query += ", ";
                }
                break;
            case 6:
                query += `(t5_id,descr,dl,resolved) VALUES `;
                for (var i=0;i<table.length;i++) {
                    query += `(${table[i][0]},\'${table[i][1]}\',\'${table[i][2]}\',${table[i][3]?"TRUE":"FALSE"})`;
                    if (i!==table.length-1) query += ", ";
                }
                break;
            case 7:
                query += `(t2_id_1,t2_id_2,msg,time,seen) VALUES `;
                for (var i=0;i<table.length;i++) {
                    query += `(${table[i][0]},${table[i][1]},\'${table[i][2]}\',${table[i][3]},${table[i][4]?"TRUE":"FALSE"})`;
                    if (i!==table.length-1) query += ", ";
                }
                break;
            case 8:
                query += `(t2_id,login,logout,hash) VALUES `;
                for (var i=0;i<table.length;i++) {
                    query += `(${table[i][0]},${table[i][1]},${table[i][2]===null?"NULL":table[i][2]},\'${table[i][3]}\')`;
                    if (i!==table.length-1) query += ", ";
                }
                break;
            case 9:
                query += `(t6_id,t2_id,msg,atch,time) VALUES `;
                for (var i=0;i<table.length;i++) {
                    query += `(${table[i][0]},${table[i][1]},\'${table[i][2]}\',${table[i][3]===null?"NULL":"\'"+table[i][3]+"\'"},${table[i][4]})`;
                    if (i!==table.length-1) query += ", ";
                }
                break;
        }
        query += ";";
        return query;
    }

    static getDeleteTableQuery(tableIndex) {
        if (!Number.isInteger(tableIndex)) throw "SequentialTestUtils: getDeleteTableQuery(): invalid input";
        if (tableIndex<=0||tableIndex>=10) throw "SequentialTestUtils: getDeleteTableQuery(): invalid input";
        return `DROP TABLE IF EXISTS t${tableIndex};`;
    }

    static async loadTable(tableIndex) {
        if (!Number.isInteger(tableIndex)) throw "SequentialTestUtils: loadTable(): invalid input";
        if (tableIndex<=0||tableIndex>=10) throw "SequentialTestUtils: loadTable(): invalid input";
        await db.getDb().any(SequentialTestUtils.createTableCommands[tableIndex-1]);
        await db.getDb().any(SequentialTestUtils.getLoadTableQuery(tableIndex));
    }

    static async loadAllTables() {
        for (var i=1;i<10;i++) {
            await SequentialTestUtils.loadTable(i);
        }
    }

    static async deleteTable(tableIndex) {
        if (!Number.isInteger(tableIndex)) throw "SequentialTestUtils: deleteTable(): invalid input";
        if (tableIndex<=0||tableIndex>=10) throw "SequentialTestUtils: deleteTable(): invalid input";
        await db.getDb().any(SequentialTestUtils.getDeleteTableQuery(tableIndex));
    }

    static async deleteAllTables() {
        for (var i=9;i>0;i--) {
            await SequentialTestUtils.deleteTable(i);
        }
    }
}

module.exports = SequentialTestUtils;