const db = require('../db/database');
const sequentialTestUtils = require('./sequentialTestUtils');
const axios = require("axios");
const https = require("https");

class RouteTestTemplate {

    constructor() {
        sequentialTestUtils.initializeDatabase();
        RouteTestTemplate.initializeClient();
    }

    async run(choice) {
        await this.initialize();
        var result = await (this.getTestBody()[choice])();
        await this.unload();
        return result;
    }

    get testSuiteDescription() {
        return null;
    }

    getTestBody() {
        throw "RouteTestTemplate: getTestBody(): method must be overriden";
        return [];
    }

    runTests() {
        describe(this.path,()=>{
            for (var i=0;i<this.getTestBody().length;i++) {
                const j = i;
                test(`Test ${j+1}`,()=>{
                    return this.run(j).then((result)=>{
                        expect(result).toEqual(true);
                    }).catch((err)=>{
                        expect(true).toEqual(false); // Test failed
                    });
                });
            }
        });
        
    }

    async initialize() {
        await sequentialTestUtils.loadAllTables();
    }

    async unload() {
        await sequentialTestUtils.deleteAllTables();
    }

    async makeQuery(query) {
        return await db.getDb().any(query);
    }

    matchObject(obj1,obj2) {
        return JSON.stringify(obj1)===JSON.stringify(obj2);
    }

    getPath() {
        throw "RouteTestTemplate: getPath(): method must be overriden";
        return "";
    }

    static initializeClient() {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        RouteTestTemplate.clientInstance = axios.create({
            httpsAgent: new https.Agent({  
              rejectUnauthorized: false
            })
        });
    }

    async postAndGetResponse(jsObj) {
        if (RouteTestTemplate.clientInstance===undefined) throw "RouteTestTemplate: Client not initialized";
        var response = null;
        try {
            response = await RouteTestTemplate.clientInstance.post(`https://${sequentialTestUtils.apiHostname}:${sequentialTestUtils.apiPort}${this.path}`,jsObj);
            return {
                "status": 200,
                "data": response.data
            }
        }
        catch (err) {
            return {
                "status": err.response.status,
                "data": err.response.data
            }
        }
    }
}

module.exports = RouteTestTemplate;