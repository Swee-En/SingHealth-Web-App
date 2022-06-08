var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./db/database');
var cors = require('cors');

db.initializeDb('postgres','postgres','localhost',5432,'main_test');
//db.initializeDb('postgres','postgres','localhost',5432,'testing_database');

var app = express();

app.use(cors());

var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');

var addUserRouter = require('./routes/addUser');
var deleteUserRouter = require('./routes/deleteUser');
var updateUserDataRouter = require('./routes/updateUserData');
var updateUserCredRouter = require('./routes/updateUserCred');

var addInstitutionRouter = require('./routes/addInstitution');
var deleteInstitutionRouter = require('./routes/deleteInstitution');
var updateInstitutionRouter = require('./routes/updateInstitution');

var addOutletRouter = require('./routes/addOutlet');
var deleteOutletRouter = require('./routes/deleteOutlet');
var updateOutletRouter = require('./routes/updateOutlet');

var addNotificationRouter = require('./routes/addNotification');
var markNotificationsRouter = require('./routes/markNotifications');

var getUserInfoRouter = require('./routes/getUserInfo');
var getOutletsInfoRouter = require('./routes/getOutletsInfo');
var getInstitutionInfoRouter = require('./routes/getInstitutionInfo');
var getAuditsInfoRouter = require('./routes/getAuditsInfo');
var getIssuesInfoRouter = require('./routes/getIssuesInfo');
var getIssuePostsInfoRouter = require('./routes/getIssuePostsInfo');
var getNotificationsInfoRouter = require('./routes/getNotificationsInfo');

var queryInstitutionListRouter = require('./routes/queryInstitutionList');
var queryUserListRouter = require('./routes/queryUserList');
var querySessionListRouter = require('./routes/querySessionList');
var queryOutletListRouter = require('./routes/queryOutletList');
var queryAuditListRouter = require('./routes/queryAuditList');
var queryNotificationListRouter = require('./routes/queryNotificationList');

var getAdminDashboardDataRouter = require('./routes/getAdminDashboardData');
var getStaffDashboardDataRouter = require('./routes/getStaffDashboardData');
var getTenantDashboardDataRouter = require('./routes/getTenantDashboardData');

var submitChecklistRouter = require('./routes/submitChecklist');
var submitIssueRouter = require('./routes/submitIssue');
var updateIssueRouter = require('./routes/updateIssue');
var addIssuePostRouter = require('./routes/addIssuePost');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/login',loginRouter);
app.use('/logout',logoutRouter);

app.use('/addUser',addUserRouter);
app.use('/deleteUser',deleteUserRouter);
app.use('/updateUserData',updateUserDataRouter);
app.use('/updateUserCred',updateUserCredRouter);
 
app.use('/addInstitution',addInstitutionRouter);
app.use('/deleteInstitution',deleteInstitutionRouter);
app.use('/updateInstitution',updateInstitutionRouter);

app.use('/addOutlet',addOutletRouter);
app.use('/deleteOutlet',deleteOutletRouter);
app.use('/updateOutlet',updateOutletRouter);

app.use('/addNotification',addNotificationRouter);
app.use('/markNotifications',markNotificationsRouter);

app.use('/getUserInfo',getUserInfoRouter);
app.use('/getOutletsInfo',getOutletsInfoRouter);
app.use('/getInstitutionInfo',getInstitutionInfoRouter);
app.use('/getAuditsInfo',getAuditsInfoRouter);
app.use('/getIssuesInfo',getIssuesInfoRouter);
app.use('/getIssuePostInfo',getIssuePostsInfoRouter);
app.use('/getNotificationsInfo',getNotificationsInfoRouter);

app.use('/queryInstitutionList',queryInstitutionListRouter);
app.use('/queryUserList',queryUserListRouter);
app.use('/querySessionList',querySessionListRouter);
app.use('/queryOutletList',queryOutletListRouter);
app.use('/queryAuditList',queryAuditListRouter);
app.use('/queryNotificationList',queryNotificationListRouter);

app.use('/getAdminDashboardData',getAdminDashboardDataRouter);
app.use('/getStaffDashboardData',getStaffDashboardDataRouter);
app.use('/getTenantDashboardData',getTenantDashboardDataRouter);

app.use('/submitChecklist',submitChecklistRouter);
app.use('/submitIssue',submitIssueRouter);
app.use('/updateIssue',updateIssueRouter);
app.use('/addIssuePost',addIssuePostRouter);

app.get('/testConnection',(req,res)=>{
  res.status(200).json({"connect_success": true});
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("");
});

module.exports = app;
