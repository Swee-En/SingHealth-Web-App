import BackendUtils from "../backendUtils/backendUtils";
import DataClass from "./dataClass";

var crypto = require("crypto");

export default class User extends DataClass {

    constructor(data) {
        super();

        const CONSTRUCTOR_ERROR = "User: constructor(): invalid input";
        const CONSTRUCTOR_REQUIREMENTS = ["id","name","type","email","institutionId"];
        
        if (data===null) throw CONSTRUCTOR_ERROR;
        if (typeof data!=='object') throw CONSTRUCTOR_ERROR;

        for (var i in CONSTRUCTOR_REQUIREMENTS){
            if (!(CONSTRUCTOR_REQUIREMENTS[i] in data)) throw CONSTRUCTOR_ERROR;
        }

        this.id = data["id"];
        this.sessionId = "sessionId" in data? data["sessionId"]:null;
        this.name = data["name"];
        this.type = data["type"];
        this.institution = data["institutionId"];
        this.emailAddress = data["email"];
    }

    checkIfLoggedIn() {
        return this.sessionId!==null;
    }

    getSessionId() {
        return this.sessionId;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }

    getInstitution() {
        return this.institution;
    }

    /**
     * Update this user's password. May be done with the current user on behalf of another, if he/she has permissions 
     * Return values:
     * - 0: success
     * - 1: not permitted
     * - 2: user not found
     * - 3: service temporarily unavailable
     * - -1: invalid session
     * @param {User:null} performingUser User object representing user performing action,
     * @param {string} oldPassword string for old password
     * @param {string} newPassword string for new password
     * @param {function} endCallback callback receiving return value
     */
    setPassword(performingUser, oldPassword, newPassword, endCallback) {

        if (typeof newPassword !== 'string') throw "User: setPassword(): invalid argument(s)";
        if (typeof oldPassword !== 'string') throw "User: setPassword(): invalid argument(s)";
        if ((performingUser!==null) && !(performingUser instanceof User)) throw "User: setPassword(): invalid argument(s)";

        var sessionId = null;
        if (performingUser===null) {
            if (this.sessionid===null) throw "User: setPassword(): cannot set password without logged in User";
            sessionId = this.sessionId;
        }
        else {
            if (performingUser!==this && performingUser.getType()!==0) {
                endCallback(1);
                return;
            }
            if (performingUser.getSessionId()===null) throw "User: setPassword(): cannot set password without logged in User";
            sessionId = performingUser.getSessionId();
        }

        var oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('hex');
        var newPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');

        BackendUtils.postAndGetJson(
            '/updateUserCred',
            {
                "sessionId": sessionId,
                "userId": this.id,
                "oldPassword": oldPasswordHash,
                "newPassword": newPasswordHash
            },
            (data)=>{
                if ("error" in data) {
                    var errorVal = BackendUtils.checkStandardErrors(data,3,1);
                    if (!errorVal) errorVal = 2;
                    endCallback(errorVal);
                    return;
                }
                endCallback(0);
                return;
            },
            (err)=>{
                endCallback(3);
                return;
            }

        )
    }

    /**
     * Switch this user's institution. A logged-in admin must do this. Additionally this object is updated if successful
     * Return values:
     * - 0: success
     * - 1: not permitted
     * - 2: user not found
     * - 3: institution not found
     * - 4: service temporarily unavailable
     * - -1: invalid session
     * @param {User:null} performingUser User object if an admin is performing action on behalf of another, or null
     * @param {Number} institutionId integer institution id to change to
     * @param {function} endCallback callback to pass return value to
     */
    setInstitution(performingUser,institutionId,endCallback) {
        if (!Number.isInteger(institutionId)) throw "User: setInstitution(): invalid argument(s)";
        if ((performingUser!==null) && !(performingUser instanceof User)) throw "User: setInstitution(): invalid argument(s)";

        var sessionId = null;
        if (performingUser===null) {
            if (this.sessionId===null) throw "User: setInstitution(): cannot set institution without logged in user";
            if (this.getType()!==0) {
                endCallback(1);
                return;
            }
            sessionId = this.sessionId;
        }
        else {
            if (performingUser.getSessionId()===null) throw "User: setInstitution(): cannot set institution without logged in user";
            if (performingUser!==this && performingUser.getType()!==0) {
                endCallback(1);
                return;
            }
            sessionId = performingUser.getSessionId();
        }

        BackendUtils.postAndGetJson(
            "/updateUserData",
            {
                "sessionId": sessionId,
                "userId": this.id,
                "institutionId": institutionId
            },
            (data)=>{
                if ("error" in data) {
                    var errorVal = BackendUtils.checkStandardErrors(data,4,1);
                    if (errorVal) {
                        endCallback(errorVal);
                        return;
                    }
                    if (data["error"]==="USER_NOT_FOUND") errorVal = 2;
                    else errorVal = 3;
                    endCallback(errorVal);
                    return;
                }
                this.institution = institutionId;
                endCallback(0);
                return;
            },
            (err)=>{
                endCallback(4);
                return;
            }
            
        )

    }

    getEmailAddress() {
        return this.emailAddress;
    }

    /**
     * Change this user's email. Only admin can change others' email
     * Return values:
     * - 0: success
     * - 1: not permitted
     * - 2: user not found
     * - 3: invalid email format
     * - 4: service temporarily unavailable
     * - -1: invalid session
     * @param {User:null} performingUser User object of current user performing operation, or null
     * @param {string} emailAddress email address to change to
     * @param {function} endCallback callback receiving return value
     */
    setEmailAddress(performingUser,emailAddress,endCallback) {
        if (typeof emailAddress !== 'string') throw "User: setEmailAddress(): invalid argument(s)";
        if ((performingUser!==null) && !(performingUser instanceof User)) throw "User: setEmailAddress(): invalid argument(s)";
        if (!/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(emailAddress)) {
            endCallback(3);
            return;
        }

        var sessionId = null;
        if (performingUser !== null) {
            if (this.sessionId===null) throw "User: setEmailAddress(): cannot set institution without logged in user";
            sessionId = this.sessionId;
        }
        else {
            if (performingUser.getSessionId()===null) throw "User: setEmailAddress(): cannot set institution without logged in user";
            if (performingUser!==this && performingUser.getType()!==0) {
                endCallback(1);
                return;
            }
            sessionId = performingUser.getSessionId();
        }

        BackendUtils.postAndGetJson(
            "/updateUserData",
            {
                "sessionId": sessionId,
                "userId": this.id,
                "email": emailAddress
            },
            (data)=>{
                var errorVal = null;
                if ("error" in data){
                    errorVal = BackendUtils.checkStandardErrors(data,4,1);
                    if (errorVal) {
                        endCallback(errorVal);
                        return;
                    }
                    if (data["error"]==="USER_NOT_FOUND") errorVal = 2;
                    else errorVal = 3;
                    endCallback(errorVal);
                    return;
                }
                this.emailAddress = emailAddress;
                endCallback(0);
                return;
            },
            (err)=>{
                endCallback(4);
                return;
            }
        )

    }
}