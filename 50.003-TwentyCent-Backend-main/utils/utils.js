class Utils {
    static checkRequestCompleteness(req,elementList) {
        if (!("body" in req)) return false;
        if (typeof req.body !== 'object' || req.body === null) return false;
        for (var i in elementList) {
            if (!(elementList[i] in req.body)) return false;
        }
        return true;
    }

    static getCurrentTimestampInSeconds() {
        return Math.floor(new Date().valueOf()/1000);
    }

    static dateStringToInt(str) {
        return Date.UTC(Number.parseInt(str.substring(0,4),10),Number.parseInt(str.substring(5,7),10)-1,Number.parseInt(str.substring(8,10),10));
    }

    static intToDateString(int) {
        const date = new Date(int);
        var day = "" + date.getUTCDate();
        if (day.length==1) day = "0" + day;
        var month = "" + `${date.getUTCMonth()+1}`;
        if (month.length==1) month = "0" + month;
        var year = "" + date.getUTCFullYear();
        while (year.length<4) year = "0" + year;
        return `${year}-${month}-${day}`;
    }

    static compareDateString(str1,str2) {
        const val1 = Utils.dateStringToInt(str1);
        const val2 = Utils.dateStringToInt(str2);
        if (val1<val2) return -1;
        if (val1===val2) return 0;
        return 1;
    }

    static btoa(str) {
        if (typeof str !== 'string') throw "Utils: btoa(): invalid input";
        return Buffer.from(str).toString('base64');
    }

    static atob(str) {
        if (typeof str !== 'string') throw "Utils: atob(): invalid input";
        return Buffer.from(str,'base64').toString();
    }
}

module.exports = Utils;