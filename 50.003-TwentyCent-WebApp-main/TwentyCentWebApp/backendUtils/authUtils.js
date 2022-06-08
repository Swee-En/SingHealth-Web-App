import BackendUtils from "./backendUtils";
import User from "../dataClasses/user";
import { SYSTEM_BRIGHTNESS } from "expo-permissions";

var crypto = require("crypto");

export default class AuthUtils {
    
    /**
     * Attempt login. On success, return User object
     * Otherwise, return integer: 1 if invalid credentials, else 2 if service is unavailable
     * @param {string} username username
     * @param {string} password password
     * @param {function} endCallback callback function receiving return value
     */
    static login(username,password,endCallback) {

        var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        BackendUtils.postAndGetJson(
            '/login',
            {
                "username": username,
                "password": hashedPassword
            },
            (data)=>{
                if ("error" in data) {
                    if (BackendUtils.checkServiceError(data)) {
                        endCallback(2);
                        return;
                    }
                    endCallback(1);
                    return;
                }
                endCallback(new User(data));
                return;
            },
            (err)=>{
                endCallback(2);
                return;
            }
        )
    }

    /**
     * Logout properly. This terminates the session
     * Passes to callback 0 if success or 1 if an error occurred
     * @param {User} user User object with valid sessionId
     * @param {function} endCallback callback receiving return value
     */
    static logout(user,endCallback) {
        if (!(user instanceof User)) {
            throw "AuthUtils: logout(): invalid user argument";
        }
        if (user.getSessionId()===null) throw "AuthUtils: logout(): user is not logged in";
        BackendUtils.postAndGetJson(
            '/logout',
            {"sessionId": user.getSessionId()},
            (data)=>{
                if (BackendUtils.checkStandardErrors(data,1,1)) {
                    endCallback(1);
                    return;
                }
                endCallback(0);
                return;
            },
            (err)=>{
                endCallback(1);
                return;
            }
        )
    }

}