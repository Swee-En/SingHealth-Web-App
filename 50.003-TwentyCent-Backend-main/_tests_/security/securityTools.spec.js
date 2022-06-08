var securityTools = require('../../security/securityTools');

describe("SecurityTools.checkSanitizedAlphanumeric()",()=>{
    test(`Test 1`,()=>{
        expect(securityTools.checkSanitizedAlphanumeric("sdfasdfadfasdf12312390jjdjkljsdf")).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkSanitizedAlphanumeric("")).toEqual(true);
    });

    test(`Test 3`,()=>{
        expect(securityTools.checkSanitizedAlphanumeric("sdf==1j0'][l;;")).toEqual(false);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkSanitizedAlphanumeric(1)).toEqual(false);
    });

});

describe("SecurityTools.checkSanitizedUsername()",()=>{

    test(`Test 1`,()=>{
        expect(securityTools.checkSanitizedUsername("")).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkSanitizedUsername("asdjfapojdflj")).toEqual(true);
    });

    test(`Test 3`,()=>{
        expect(securityTools.checkSanitizedUsername("asdfasd12312312ass")).toEqual(true);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkSanitizedUsername("12dsa=d;;/] -=g")).toEqual(false);
    });

    test(`Test 5`,()=>{
        expect(securityTools.checkSanitizedUsername("a_a")).toEqual(true);
    });

    test(`Test 6`,()=>{
        expect(securityTools.checkSanitizedUsername([128301923])).toEqual(false);
    });

});

describe("SecurityTools.checkSanitizedPersonName()",()=>{
   
    test(`Test 1`,()=>{
        expect(securityTools.checkSanitizedPersonName("")).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkSanitizedPersonName("Yeet aa sdfsdf dsfdfsa")).toEqual(true);
    });

    test(`Test 3`,()=>{
        expect(securityTools.checkSanitizedPersonName("Yeet aa sdfsdf d.[;.`sfdfsa")).toEqual(false);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkSanitizedPersonName(null)).toEqual(false);
    });

});

describe("SecurityTools.checkSanitizedString()",()=>{
   
    test(`Test 1`,()=>{
        expect(securityTools.checkSanitizedString("")).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkSanitizedString("Yeet aa sdfssdfdf dsfdfsa")).toEqual(true);
    });

    test(`Test 3`,()=>{
        expect(securityTools.checkSanitizedString("Yeet aa sdfaaaasdf d.[;.`sfdfsa")).toEqual(false);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkSanitizedString(null)).toEqual(false);
    });

    test(`Test 5`,()=>{
        expect(securityTools.checkSanitizedString("Yeet aa sdfsdf, dsfdfsa")).toEqual(true);
    });

    test(`Test 6`,()=>{
        expect(securityTools.checkSanitizedString("Yeet aa sdfsdf, dsfd-sfdsd-123123fsa")).toEqual(true);
    });

});

describe("SecurityTools.checkSanitizedEmail()",()=>{

    test(`Test 1`,()=>{
        expect(securityTools.checkSanitizedEmail("")).toEqual(false);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkSanitizedEmail("a@b.c")).toEqual(true);
    });

    test(`Test 3`,()=>{
        expect(securityTools.checkSanitizedEmail("@@@@@@@")).toEqual(false);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkSanitizedEmail("0128312ndjshflkh@a9sudfsldhf.a0dkfjsdl.ai0udfjh")).toEqual(true);
    });

    test(`Test 5`,()=>{
        expect(securityTools.checkSanitizedEmail("rarw@dpdpdp")).toEqual(false);
    });

    test(`Test 6`,()=>{
        expect(securityTools.checkSanitizedEmail("-1=jdlkjls@..dljsldofl@hjksdkjf")).toEqual(false);
    });

    test(`Test 7`,()=>{
        expect(securityTools.checkSanitizedEmail([[{}]])).toEqual(false);
    });

});

describe("SecurityTools.checkInteger()",()=>{
    
    test(`Test 1`,()=>{
        expect(securityTools.checkInteger(1)).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkInteger(0.1)).toEqual(false);
    });

    test(`Test 3`,()=>{
        expect(securityTools.checkInteger("0")).toEqual(false);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkInteger(null)).toEqual(false);
    });

});

describe("SecurityTools.checkSanitizedDate()",()=>{

    test(`Test 1`,()=>{
        expect(securityTools.checkSanitizedDate("aaa-ssss-ddddd")).toEqual(false);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkSanitizedDate("2000-05-01")).toEqual(true);
    });

    test(`Test 3`,()=>{
        expect(securityTools.checkSanitizedDate("0001-09-09")).toEqual(true);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkSanitizedDate("klkdjfa=123=-12-3")).toEqual(false);
    });

    test(`Test 5`,()=>{
        expect(securityTools.checkSanitizedDate("0001-13-29")).toEqual(false);
    });

    test(`Test 6`,()=>{
        expect(securityTools.checkSanitizedDate("0001-01-00")).toEqual(false);
    });

    test(`Test 7`,()=>{
        expect(securityTools.checkSanitizedDate(null)).toEqual(false);
    })

});

describe("SecurityTools.checkBase64()",()=>{
    
    test(`Test 1`,()=>{
        expect(securityTools.checkBase64("/////////////")).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkBase64("=sa=a=sd=fa=sdf=as=fjnkneqkmwlemqlwemqwe///////")).toEqual(false);
    });
    
    test(`Test 3`,()=>{
        expect(securityTools.checkBase64("ajdfjallKNOFWKENFKDSLJFLSDLFALSDNMC+++sdf///=")).toEqual(true);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkBase64(null)).toEqual(false);
    });

});

describe("SecurityTools.checkAttachment()",()=>{
    
    test(`Test 1`,()=>{
        expect(securityTools.checkAttachment("/////////////")).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkAttachment("=sa=a=sd=fa=sdf=as=fjnkneqkmwlemqlwemqwe///////")).toEqual(false);
    });
    
    test(`Test 3`,()=>{
        expect(securityTools.checkAttachment("ajdfjallKNOFWKENFKDSLJFLSDLFALSDNMC+++sdf///=")).toEqual(true);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkAttachment(null)).toEqual(true);
    });

    test(`Test 5`,()=>{
        expect(securityTools.checkAttachment(undefined)).toEqual(false);
    });

});

describe("SecurityTools.checkChecklistFormat()",()=>{

    test(`Test 1`,()=>{
        expect(securityTools.checkChecklistFormat([
            {"categoryName": "catA", "questionList":[
                {"question": "a", "maxScore": 1, "actScore": 0.1}
            ]}
        ],true)).toEqual(true);
    });

    test(`Test 2`,()=>{
        expect(securityTools.checkChecklistFormat([
            {"categoryName": "catA", "questionList":[
                {"question": "a", "maxScore": "aaaaa", "actScore": 0.1}
            ]}
        ],true)).toEqual(false);
    });

    test(`Test 3`,()=>{
        expect(securityTools.checkChecklistFormat([
            {"categoryNaasdfame": "cataaA", "questiaaaonList":[
                {"question": "a", "maxScore": 5, "actScore": 0.1}
            ],"a":"aaaa"}
        ],true)).toEqual(false);
    });

    test(`Test 4`,()=>{
        expect(securityTools.checkChecklistFormat(null,true)).toEqual(false);
    });

    test(`Test 5`,()=>{
        expect(securityTools.checkChecklistFormat([
            {"categoryName": "catA", "questionList":[
                {"question": "a", "maxScore": 1, "actScore": 0.1}
            ]},
            {"categoryName": "catc", "questionList":[
                {"question": "b", "maxScore": 1, "actScore": 0.1}
            ]},
            {"categoryName": "catd", "questionList":[
                {"question": "a", "maxScore": 12312.223, "actScore": 0.1}
            ]}
        ],true)).toEqual(true);
    });

    test(`Test 6`,()=>{
        expect(securityTools.checkChecklistFormat([
            {"categoryName": "catA", "questionList":[
                {"question": "a", "maxScore": 1, "actScore": 0.1}
            ]},
            {"categoryName": "catc", "questionList":[
                {"question": "b", "maxScore": 1, "actScore": 0.1}
            ]},
            {"categoryName": "catd", "questionList":[
                {"question": "a", "maxScore": 12312.223, "actScore": 0.1}
            ]}
        ],false)).toEqual(false);
    });

    test(`Test 7`,()=>{
        expect(securityTools.checkChecklistFormat([
            {"categoryName": "catA", "questionList":[
                {"question": "a", "maxScore": 1, "actScore": 0.1}
            ]},
            {"categoryName": "catc", "questionList":[
                {"question": "b", "actScore": 0.1}
            ]},
            {"categoryName": "catd", "questionList":[
                {"question": "a", "maxScore": 12312.223}
            ]}
        ],false)).toEqual(false);
    });

    test(`Test 8`,()=>{
        expect(securityTools.checkChecklistFormat([
            {"categoryName": "catA", "questionList":[
                {"question": "a", "maxScore": 1}
            ]},
            {"categoryName": "catc", "questionList":[
                {"question": "b", "maxScore": 1123123}
            ]},
            {"categoryName": "catd", "questionList":[
                {"question": "a", "maxScore": 12312.223}
            ]}
        ],false)).toEqual(true);
    });

    test(`Test 9`,()=>{
        expect(securityTools.checkChecklistFormat([
            {"categoryName": "catA", "questionList":[
                {"question": "a", "maxScore": 1}
            ]},
            {"questionList":[
                {"question": "b", "maxScore": 1123123}
            ]},
            {"categoryName": "catd", "questionList":[
                {"question": "a", "maxScore": 12312.223}
            ]}
        ],false)).toEqual(false);
    });

    test(`Test 10`,()=>{
        expect(securityTools.checkChecklistFormat({},false)).toEqual(false);
    });

    test(`Test 11`,()=>{
        expect(securityTools.checkChecklistFormat([
            {"categoryName": "catA", "questionList":[
                {"question": "a", "maxScore": 1}
            ]},
            {"categoryName": "catc"},
            {"categoryName": "catd", "questionList":[
                {"question": "a", "maxScore": 12312.223}
            ]}
        ],false)).toEqual(false);
    });

});




