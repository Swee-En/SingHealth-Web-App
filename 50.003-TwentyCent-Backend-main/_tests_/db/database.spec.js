var db = require("../../db/database");

class TestingRes {
        
    constructor() {
        this.statusRecord = null;
        this.jsonRecord = null;
    }

    status(stat) {
        this.statusRecord = stat;
        return this;
    }

    json(jsObj) {
        this.jsonRecord = jsObj;
        return this;
    }

    checkAcceptedValues(expectedStatus,expectedJsObj) {
        if (this.statusRecord !== expectedStatus) return false;
        if (this.jsonRecord === null) return false;
        if (JSON.stringify(this.jsonRecord)!==JSON.stringify(expectedJsObj)) return false;
        return true;
    }

    checkRejectedValues() {
        return this.statusRecord===null && this.jsonRecord===null;
    }
}

describe("db.checkUnknownError()",()=>{
    
    test(`Test 1`,()=>{
        expect(db.checkUnknownError(db.returnUnknownError())).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(db.checkUnknownError(db.returnNotPermittedError())).toEqual(false);
    });

    test(`Test 3`,()=>{
        expect(db.checkUnknownError(null)).toEqual(false);
    });

});

describe("db.checkInvalidSessionError()",()=>{
    
    test(`Test 1`,()=>{
        expect(db.checkInvalidSessionError(db.returnInvalidSessionError())).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(db.checkInvalidSessionError(db.returnNotPermittedError())).toEqual(false);
    });

    test(`Test 3`,()=>{
        expect(db.checkInvalidSessionError(null)).toEqual(false);
    });
    
});

describe("db.checkBadRequestError()",()=>{
    
    test(`Test 1`,()=>{
        expect(db.checkBadRequestError(db.returnBadRequestError())).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(db.checkBadRequestError(db.returnInvalidSessionError())).toEqual(false);
    });

    test(`Test 3`,()=>{
        expect(db.checkBadRequestError(null)).toEqual(false);
    });
    
});

describe("db.checkNotPermittedError()",()=>{
    
    test(`Test 1`,()=>{
        expect(db.checkNotPermittedError(db.returnNotPermittedError())).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(db.checkNotPermittedError(db.returnUnknownError())).toEqual(false);
    });

    test(`Test 3`,()=>{
        expect(db.checkNotPermittedError(null)).toEqual(false);
    });
    
});

describe("db.handleIfDefaultError()",()=>{

    test(`Test 1`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfDefaultError(testingRes,null);

        expect((result===false)&&testingRes.checkRejectedValues()).toEqual(true);
    });

    test(`Test 2`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfDefaultError(testingRes,db.returnUnknownError());
        
        expect((result===true)&&testingRes.checkAcceptedValues(500,db.returnUnknownError())).toEqual(true);
    });

    test(`Test 3`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfDefaultError(testingRes,db.returnInvalidSessionError());
        
        expect((result===true)&&testingRes.checkAcceptedValues(401,db.returnInvalidSessionError())).toEqual(true);
    });

    test(`Test 4`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfDefaultError(testingRes,db.returnBadRequestError());
        
        expect((result===true)&&testingRes.checkAcceptedValues(400,db.returnBadRequestError())).toEqual(true);
    });

    test(`Test 5`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfDefaultError(testingRes,db.returnNotPermittedError());
        
        expect((result===true)&&testingRes.checkAcceptedValues(401,db.returnNotPermittedError())).toEqual(true);
    });

    test(`Test 6`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfDefaultError(testingRes,{"success": true});

        expect((result===false)&&testingRes.checkRejectedValues()).toEqual(true);
    });
});

describe("db.handleIfGeneralError()",()=>{

    test(`Test 1`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfGeneralError(testingRes,null);

        expect((result===false)&&testingRes.checkRejectedValues()).toEqual(true);
    });

    test(`Test 2`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfGeneralError(testingRes,db.returnUnknownError());
        
        expect((result===true)&&testingRes.checkAcceptedValues(500,db.returnUnknownError())).toEqual(true);
    });

    test(`Test 3`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfGeneralError(testingRes,db.returnInvalidSessionError());
        
        expect((result===true)&&testingRes.checkAcceptedValues(401,db.returnInvalidSessionError())).toEqual(true);
    });

    test(`Test 4`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfGeneralError(testingRes,db.returnBadRequestError());
        
        expect((result===true)&&testingRes.checkAcceptedValues(400,db.returnBadRequestError())).toEqual(true);
    });

    test(`Test 5`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfGeneralError(testingRes,db.returnNotPermittedError());
        
        expect((result===true)&&testingRes.checkAcceptedValues(401,db.returnNotPermittedError())).toEqual(true);
    });

    test(`Test 6`,()=>{
        var testingRes = new TestingRes();
        var result = db.handleIfGeneralError(testingRes,{"success": true});

        expect((result===false)&&testingRes.checkRejectedValues()).toEqual(true);
    });

    test(`Test 7`,()=>{
        const errorObj = {"error": "test"};
        var testingRes = new TestingRes();
        var result = db.handleIfGeneralError(testingRes,errorObj);
        
        expect((result===true)&&testingRes.checkAcceptedValues(400,errorObj)).toEqual(true);
    });
});



