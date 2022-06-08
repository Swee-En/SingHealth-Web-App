import BackendUtils from "./backendUtils";
import User from "../dataClasses/user";

var crypto = require("crypto");

// TO BE COMBINED WITH /queryUtil WHEN FINISHED
// not sure if ones using crypto should be under /authUtils
export default class queryUserUtil {

    /**
     * Query user list. User must be logged in.
     * There are 3 possible return values:
     * - [ list of {
     *      "userId": userId integer,
     *      "name": string,
     *      "type": integer,
     *      "email": string,
     *      "institutionId": institutionId integer,
     *      "institutionName": string,
     *      "username": string
     *   }] (success)
     * - 1: service error
     * - -1: invalid session id
     * @param {User} user user value whose institution will be queried
     * @param {function} endCallback callback to receive return value
     */

    static getUserList(user, endCallback) {
        if (!(user instanceof User)) throw "QueryUtils: getUserList(): invalid input";
        if (user.getSessionId() === null) throw "QueryUtils: getUserList(): user must be logged in";

        BackendUtils.postAndGetJson(
            "/queryUserList",
            {
                "sessionId": user.getSessionId(),
                "type": user.getType(),
                "institutionId": user.getInstitution()
            },
            (data) => {
                var handle = BackendUtils.checkStandardErrors(data, 1, null);
                if (handle) {
                    endCallback(handle);
                    return;
                }
                endCallback(data);
                return;
            }, (err) => {
                endCallback(1);
                return;
            });
    }

    /**
     * Add User. User must be logged in.
     * There are 3 possible return values:
     * - {"userId": integer userId} (success)
     * - 1: service error
     * - -1: invalid session id
     * @param {User} user user value whose institution will be queried
     * @param {string} name 
     * @param {integer} type {0: admin, 1: staff, 2:tenant}
     * @param {String} email 
     * @param {integer} institutionId 
     * @param {string} username
     * @param {string} password
     * @param {function} endCallback callback to receive return value
     * 
     * CAN ONLY BE INVOKED BY NON-TENANTS - STAFF CAN ONLY CREATE TENANT ACCOUNTS
     */

    static addUser(user, name, type, email, institutionId, username, password, endCallback) {
        if (!(user instanceof User)) throw "QueryUtils: addUser(): invalid input";
        if (user.getSessionId() === null) throw "QueryUtils: addUser(): user must be logged in";

        var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        BackendUtils.postAndGetJson(
            "/addUser",
            {
                "sessionId": user.getSessionId(),
                "name": name,
                "type": type,
                "email": email,
                "institutionId": institutionId,
                "username": username,
                "password": hashedPassword
            }, 
            (data) => {
                var handle = BackendUtils.checkStandardErrors(data, 1, null);
                if (handle) {
                    endCallback(handle);
                    return;
                }
                endCallback(data);
                return;
            }, (err) => {
                endCallback(1);
                return;
            });
    }

    /**
     * Delete User. User must be logged in.
     * There are 3 possible return values:
     * - {"success": true} (success)
     * - 1: service error
     * - -1: invalid session id
     * @param {User} user user value whose institution will be queried
     * @param {integer} userId
     * @param {function} endCallback callback to receive return value
     * 
     * CAN ONLY BE INVOKED BY NON-TENANTS - STAFF CAN ONLY DELETE TENANTS
     */

    static deleteUser(user, userId, endCallback) {
        if (!(user instanceof User)) throw "QueryUtils: deleteUser(): invalid input";
        if (user.getSessionId() === null) throw "QueryUtils: deleteUser(): user must be logged in";

        BackendUtils.postAndGetJson(
            "/addUser",
            {
                "sessionId": user.getSessionId(),
                "userId": userId
            }, 
            (data) => {
                var handle = BackendUtils.checkStandardErrors(data, 1, null);
                if (handle) {
                    endCallback(handle);
                    return;
                }
                endCallback(data);
                return;
            }, (err) => {
                endCallback(1);
                return;
            });
    }

    // already in authUtil?
    // /**
    //  * Update user credentials. User must be logged in.
    //  * There are 3 possible return values:
    //  * - {"success": true} (success)
    //  * - 1: service error
    //  * - -1: invalid session id
    //  * @param {User} user user value whose institution will be queried
    //  * @param {string} oldPassword 
    //  * @param {Integer} userId [optional for admin]
    //  * @param {string} username [optional]
    //  * @param {string} newPassword [optional]
    //  * @param {integer} type [optional for admin]
    //  * @param {function} endCallback callback to receive return value
    //  * 
    //  * ACCESSIBLE TO ALL
    //  * TENANTS AND STAFF CAN ONLY CHANGE OWN CREDENTIALS AND CANNOT USE USERID OR TYPE
    //  * ADMIN CAN USE ALL, BUT CANNOT CHANGE OWN TYPE
    //  * WHEN CHANGING OWN DETAILS, ALL MUST SPECIFY CURRENT PASSWORD
    //  */

    // static updateUserCred(user, oldPassword, userId, username, newPassword, type, endCallback) {
    //     if (!(user instanceof User)) throw "QueryUtils: updateUserCred(): invalid input";
    //     if (user.getSessionId() === null) throw "QueryUtils: updateUserCred(): user must be logged in";

    //     var hashedOldPassword = crypto.createHash('sha256').update(oldPassword).digest('hex');
    //     var hashedNewPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

    //     BackendUtils.postAndGetJson(
    //         "/updateUserCred",
    //         {
    //             "sessionId": user.getSessionId(),
    //             "oldPassword": hashedOldPassword,
    //             "userId": userId,
    //             "username": username,
    //             "newPassword": hashedNewPassword,
    //             "type": type
    //         }, 
    //         (data) => {
    //             var handle = BackendUtils.checkStandardErrors(data, 1, null);
    //             if (handle) {
    //                 endCallback(handle);
    //                 return;
    //             }
    //             endCallback(data);
    //             return;
    //         }, (err) => {
    //             endCallback(1);
    //             return;
    //         });
    // }

    // /**
    //  * Update user data. User must be logged in.
    //  * There are 3 possible return values:
    //  * - {"success": true} (success)
    //  * - 1: service error
    //  * - -1: invalid session id
    //  * @param {User} user user value whose institution will be queried
    //  * @param {Integer} userId 
    //  * @param {string} name [optional]
    //  * @param {String} email [optional]
    //  * @param {integer} institutionId [optional]
    //  * @param {function} endCallback callback to receive return value
    //  * 
    //  * ACCESSIBLE TO ALL FOR SELF-UPDATE, BUT ONLY ADMINS CAN CHANGE OWN INSTITUION
    //  * ACCESSIBLE TO NON-TENANTS FOR UPDATING OTHERS' ACCOUNT WITH THESE RESTRICTIONS:
    //  * - ONLY ADMIN CAN CHANGE EMAILS FOR ALL
    //  * - ONLY ADMIN CAN CHANGE INSTITUTIONS FOR STAFF, AND ONLY ADMIN AND STAFF CAN CHANGE INSTITUTIONS FOR TENANTS
    //  */

    // static updateUserData(user, userId, name, email, institutionId, endCallback) {
    //     if (!(user instanceof User)) throw "QueryUtils: updateUserData(): invalid input";
    //     if (user.getSessionId() === null) throw "QueryUtils: updateUserData(): user must be logged in";

    //     BackendUtils.postAndGetJson(
    //         "/updateUserData",
    //         {
    //             "sessionId": user.getSessionId(),
    //             "userId": userId,
    //             "name": name,
    //             "email": email,
    //             "institutionId": institutionId
    //         }, 
    //         (data) => {
    //             var handle = BackendUtils.checkStandardErrors(data, 1, null);
    //             if (handle) {
    //                 endCallback(handle);
    //                 return;
    //             }
    //             endCallback(data);
    //             return;
    //         }, (err) => {
    //             endCallback(1);
    //             return;
    //         });
    // }

}