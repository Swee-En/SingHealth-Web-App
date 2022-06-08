class SecurityTools {

    static checkSanitizedAlphanumeric(str) {
        return ((typeof str === 'string') && (/^[a-zA-Z0-9]*$/.test(str)));
    }

    static checkSanitizedUsername(str) {
        return ((typeof str === 'string') && /^[a-zA-Z0-9_]*$/.test(str));
    }

    static checkSanitizedPersonName(str) {
        return ((typeof str === 'string') && /^[a-zA-Z0-9\s]*$/.test(str));
    }
    
    static checkSanitizedString(str) {
        return ((typeof str === 'string') && /^[a-zA-Z0-9\s,#-]*$/.test(str));
    }

    static checkSanitizedEmail(str) {
        return ((typeof str === 'string') && /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(str));
    }

    static checkInteger(num) {
        return ((typeof num === 'number') && (Number.isInteger(num)));
    }

    static checkSanitizedDate(str) {
        if (typeof str !== 'string') return false;
        if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(str)) return false;
        var month = str.substring(5,6)==="0"? str.substring(6,7) : str.substring(5,7);
        month = Number.parseInt(month);
        if ((month<=0)||(month>12)) return false;
        var day = str.substring(8,9)==="0"? str.substring(9,10) : str.substring(8,10);
        day = Number.parseInt(day);
        if ((day<=0)||(day>31)) return false;
        return true;
    }

    static checkBase64(str) {
        if (typeof str !== 'string') return false;
        return /^[A-Za-z0-9+/]+={0,2}$/.test(str);
    }

    static checkAttachment(obj) {
        if (obj===null) return true;
        return SecurityTools.checkBase64(obj);
    }

    // JS object format: [list of {"categoryName":categoryString,"questionList":[list of{"question":questionString,"maxScore":integer}]}]
    // Lists cannot be empty
    // In the case of submissions, the innermost object must also have a "actScore" key with number value
    static checkChecklistFormat(checklist,isSubmission) {
        if (!Array.isArray(checklist)) return false;
        if (checklist===null) return false;
        
        if (checklist.length===0) return false;
        for (var i in checklist) {
            if (typeof checklist[i]!=='object') return false;
            if (checklist[i]===null) return false;
            var cat = checklist[i];
            if (Object.keys(cat).length!==2) return false;

            if ((!("categoryName" in cat))||(!("questionList" in cat))) return false;
            
            if (typeof cat["categoryName"]!=='string') return false;
            if (!Array.isArray(cat["questionList"])) return false;
            if (cat["questionList"].length===0) return false;


            for (var j in cat["questionList"]) {
                var qn = cat["questionList"][j];

                if (qn===null) return false;
                if (typeof qn!=='object') return false;

                if (Object.keys(qn).length!==(isSubmission?3:2)) return false;
                if ((!("question" in qn))||(!("maxScore" in qn))) return false;
                if ((isSubmission)&&(!("actScore" in qn))) return false;

                if (typeof qn["question"]!=='string') return false;
                if (typeof qn["maxScore"]!='number') return false;
                if (isSubmission) {
                    if (!("actScore") in qn) return false;
                    if (typeof qn["actScore"]!='number') return false;
                    if (qn["actScore"]>qn["maxScore"]) return false;
                }
                else {
                    if ("actScore" in qn) return false;
                }
            }

        }
        return true;
    }

    static getSessionTimeout() {
        return 60 * 120;
    }

}

module.exports = SecurityTools;