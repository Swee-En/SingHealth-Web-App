var utils = require('../../utils/utils');

describe("Utils.checkRequestCompleteness()", ()=>{

    const tests = [
        [{"body": null}, ["sessionId"], false], // Null object with non-empty list
        [{"body": null}, [], false], // Null object with empty list
        [{"body": {}},[], true], // Empty object with empty list
        [{"body": {}},["a","b"], false], // Empty object with non-empty list
        [{"body": {"test": "tester"}}, ["a","n"], false], // Non-empty object with non-matching list
        [{"body": {"a":null,"b":{}}, "tail": "head"},["a","b"],true], // Non-empty object with exact matching list
        [{"body": {"lkj3j4":"yeet","p09":"akjdlk","sui0":"ssss"}, "mest": "9898"}, ["lkj3j4", "ts", "p09", "sui0"], false], // Non-empty object with superset list
        [{"body": {"lkj3j4":"yeet","p09":"akjdlk","sui0":"ssss"}, "mest": "9898"}, ["lkj3j4", "sui0"], true], // Non-empty object with subset list
        [{"body": {"lkj3j4":"yeet","p09":"akjdlk","sui0":"ssss"}, "mest": "9898"}, ["lkj3j4", "sui0", "p09"], true] // Non-empty object with exact matching, non-ordered list
    ];

    for (var i=0;i<tests.length;i++) {
        const i1 = i;
        test(`Test ${i1+1}`,()=>{
            expect(utils.checkRequestCompleteness(tests[i1][0],tests[i1][1])).toEqual(tests[i1][2]);
        });
    }

});

describe("Utils.getCurrentTimestampInSeconds()",()=>{
    
    test(`Test 1`,()=>{
        const absDiffInSeconds = Math.abs((Date.now()/1000) - utils.getCurrentTimestampInSeconds());
        expect(absDiffInSeconds <= 2.5).toEqual(true);
    });

});

describe("Utils.dateStringToInt()",()=>{

    test(`Test 1`,()=>{
        expect(utils.dateStringToInt("2018-05-20")).toEqual(1526774400000);
    });

    test(`Test 2`,()=>{
        expect(utils.dateStringToInt("1996-12-31")).toEqual(851990400000);
    });

});

describe("Utils.intToDateString()",()=>{
    
    test(`Test 1`,()=>{
        expect(utils.intToDateString(1618049922392)).toEqual("2021-04-10");
    });

    test(`Test 2`,()=>{
        expect(utils.intToDateString(1526688050202)).toEqual("2018-05-19");
    });

});

describe("utils.compareDateString()",()=>{

    test(`Test 1`,()=>{
        expect(utils.compareDateString("2019-02-15","2019-03-31")).toEqual(-1);
    });

    test(`Test 2`,()=>{
        expect(utils.compareDateString("2019-03-31","2019-03-31")).toEqual(0);
    });

    test(`Test 3`,()=>{
        expect(utils.compareDateString("2019-03-31","2019-02-15")).toEqual(1);
    });

});



