import BackendUtils from "./backendUtils";
import User from "../dataClasses/user";


//==========TLDR FOR THIS FILE======================//
/*
 * This file contains the respective "wrapper fns" to be referenced in 
each frontend Component's onChange.
 * wrapper fns help facilitatem communication betwn frontend components 
and backend. 

*/
export default class QueryUtils {

    /**
     * Query details of the institution of the current user. User must be logged in.
     * There are 3 possible return values:
     * - {
     *      "institutionId": institutionId integer,
     *      "name": string,
     *      "address": string
     *   } (success)
     * - 1: service error
     * - -1: invalid session id
     * @param {User} user user value whose institution will be queried
     * @param {function} endCallback callback to receive return value 
     */
    static getInstitutionInfo(user,endCallback) {
        if (!(user instanceof User)) throw "QueryUtils: getInstitutionInfo(): invalid input";
        if (user.getSessionId()===null) throw "QueryUtils: getInstitutionInfo(): user must be logged in";
        BackendUtils.postAndGetJson("/getInstitutionInfo",{
            "sessionId": user.getSessionId()
        },(data)=>{
            var handle = BackendUtils.checkStandardErrors(data,1,null);
            if (handle) {
                endCallback(handle);
                return;
            }
            endCallback(data);
            return;
        },(err)=>{
            endCallback(1);
            return;
        });
    }

    /**
     * Query data sufficient to populate dashboard. Returns 1 of the following to endCallback:
     * - an object corresponding to either /getAdminDashboardData, /getStaffDashboardData or /getTenantDashboardData, on success
     * - 1 for service error
     * - -1 if invalid session
     * @param {User} user currently logged in user
     * @param {*} endCallback callback to receive return value 
     */
    static getDashboardInfo(user,endCallback) {
        if (!(user instanceof User)) throw "QueryUtils: getDashboardInfo(): invalid input";
        if (user.getSessionId()===null) throw "QueryUtils: getDashboardInfo(): user must be logged in";

        var endpoint = null;
        switch (user.getType()) {
            case 0:
                endpoint = "/getAdminDashboardData";
                break;
            case 1:
                endpoint = "/getStaffDashboardData";
                break;
            case 2:
                endpoint = "/getTenantDashboardData";
                break;
        }

        BackendUtils.postAndGetJson(endpoint,
            {"sessionId": user.getSessionId()},
            (data)=>{
                var val = BackendUtils.checkStandardErrors(data,1,null);
                if (!val) val = data;
                endCallback(val);
                return;
            },
            (err)=>{
                endCallback(1);
                return;
            }
        );
    }

    /**
     * Mark notifications as read. The endCallback receives 1 of several return values:
     * - 0 if marking is successful
     * - 1 for service error
     * - -1 if invalid session
     * User must be logged in, and only notifications corresponding to the user will be marked.
     * Additionally the array must have at least 1 element
     * @param {User} user user object
     * @param {function} endCallback callback to receive return value
     * @param {Array} notificationIdList array of IDs of notifications to be marked, must contain only integers
     */
    static markNotifications(user,endCallback,notificationIdList) {
        if (!(user instanceof User)) throw "QueryUtils: markNotifications(): invalid user object input";
        if (user.getSessionId()===null) throw "QueryUtils: markNotifications(): user must be logged in";
        if (!Array.isArray(notificationIdList)) throw "QueryUtils: markNotifications(): invalid notification ID list";
        if (notificationIdList.length===0) throw "QueryUtils: markNotifications(): notification ID list must have at least 1 element";
        for (var i=0;i<notificationIdList.length;i++) if (!Number.isInteger(notificationIdList[i])) throw "QueryUtils: markNotifications(): invalid notification ID list";

        BackendUtils.postAndGetJson("/markNotifications",
            {"sessionId":user.getSessionId(),"notificationIds":notificationIdList},
            (data)=>{
                var val = BackendUtils.checkStandardErrors(data,1,null);
                if (!val) val = 0;
                endCallback(val);
                return;
            },
            (err)=>{
                endCallback(1);
                return;
            }
        )
        
    }

//==========CAN COPY PASTE THIS TEMPLATE FOR EACH WRAPPER FN===================//
/**
 * each wrapper function only differs in terms of the backend route in the method postAndGetJson()
 * only need to do 2 things::
 * update the fn name and throws accordingly 
 * change "[CHANGE THIS TO]" below
 * */
    static someGetWrapperFn(user, endCallback) {

        //the following 2 conditions are standard checks for each wrapper fn 
        if (!(user instanceof User)) throw "QueryUtils: [CHANGE THIS: someGetWrapperFn()]: invalid input";
        if (user.getSessionId()===null) throw "QueryUtils: [CHANGE THIS: someGetWrapperFn()]: user must be logged in";

        //we call this method in BackendUtils each time we need to POST sth to database
        BackendUtils.postAndGetJson("/[CHANGE THIS TO: rsp. filename in routes in backend repo]",{
            "sessionId": user.getSessionId() //leave as is. JSON string always requires sessionId tag as first field in data
        },(data)=>{
            //leave as is
            if ("error" in data) {
                if (BackendUtils.checkInvalidSessionError) {
                    endCallback(-1);
                    return;
                }
                endCallback(1);
                return;
            }
            endCallback(data); //need help understanding this line
            return;
        },(err)=>{
            endCallback(1);
            return;
    });
    }

//======END TEMPLATE FOR EACH WRAPPER FN================//

//wrapper fn for querying Audit Reports AS AN ADMIN/STAFF (non-tenant)
static queryAuditList(user, endCallback) {

    //the following 2 conditions are standard checks for each wrapper fn 
    if (!(user instanceof User)) throw "QueryUtils: queryAuditList(): invalid input";
    if (user.getSessionId()===null) throw "QueryUtils: queryAuditList(): user must be logged in";

    //we call this method in BackendUtils each time we need to POST sth to database
    BackendUtils.postAndGetJson("/queryAuditList",{
        "sessionId": user.getSessionId() //leave as is. JSON string always requires sessionId tag as first field in data
    },(data)=>{
        //leave as first if condition as is
        if ("error" in data) {
            if (BackendUtils.checkInvalidSessionError) {
                endCallback(-1);
                return;
            }
            endCallback(1);
            return;
        }
        endCallback(data); 
        return;
    },(err)=>{
        endCallback(1);
        return;
});
}

}