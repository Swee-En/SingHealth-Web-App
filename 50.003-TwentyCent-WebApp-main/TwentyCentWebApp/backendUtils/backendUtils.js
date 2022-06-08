var https = require("https");



export default class BackendUtils {

    static get hostname() {
        return "localhost";
    }

    static get port() {
        return 3000;
    }

    static postAndGetJson(path, jsObj, completeCallback, errorCallback) {
        var req = https.request(
            {
                hostname: BackendUtils.hostname,
                port: BackendUtils.port,
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

    static checkServiceError(obj) {
        return obj["error"]==="SERVICE_TEMPORARILY_UNAVAILABLE";
    }

    static checkInvalidSessionError(obj) {
        return obj["error"]==="INVALID_SESSION";
    }

    static checkNotPermittedError(obj) {
        return obj["error"]==="NOT_PERMITTED";
    }

    /**
     * Check standard backend call errors automatically, returning false if the error is non-standard and an integer/null otherwise
     * In particular, -1 is returned for invalid session errors
     * @param {object} input the backend return value
     * @param {Number:null} serviceErrorValue value to return for service errors
     * @param {Number:null} notPermittedErrorValue value to return for non-permitted errors
     */
    static checkStandardErrors(input,serviceErrorValue,notPermittedErrorValue) {
        if (!("error" in input)) return false;
        if (BackendUtils.checkInvalidSessionError(input)) return -1;
        if (BackendUtils.checkServiceError(input)) return serviceErrorValue;
        if (BackendUtils.checkNotPermittedError(input)) return notPermittedErrorValue;
        return false;
    }
    
}