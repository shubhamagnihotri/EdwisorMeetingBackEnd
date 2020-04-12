const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const MeetingController = require("./../../app/controllers/meetingController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;


    app.get(`${baseUrl}/view/all`, auth.isAuthorized, userController.getAllUser);


    // params: userId.
    app.get(`${baseUrl}/:userId/details`, auth.isAuthorized, userController.getSingleUser);

    app.post(`${baseUrl}/checkUserOtpGenrateForForgetPassword`, userController.OtpGenrateForForgetPassword);
     /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/checkUserOtpGenrateForForgetPassword api for user signup.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Otp Generated",
            "status": 200,
            "data": {
                "email":".........",
            }

        }
         * @apiErrorExample {object} Error-Response:
         {
            "error": true,
            "message": "..........",
            "status": 404,
            "data": null

        }
    */ 
       
   app.post(`${baseUrl}/OtpValidateForForgetPassword`, userController.OtpValidateForForgetPassword); 
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/OtpValidateForForgetPassword api for validating user otp and saving password.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} otp otp for validating . (body params) (required)
     *  @apiParam {string} password password of the login. (body params) (required)
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Password Updated",
            "status": 200,
            "data": object

        }
         * @apiErrorExample {object} Error-Response:
         {
            "error": true,
            "message": "..........",
            "status": 404,
            "data": null

        }
    */ 
       

    // params: firstName, lastName, email, mobileNumber, password, apiKey.
    app.post(`${baseUrl}/signup`, userController.signUpFunction);
     /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} firstName firstName of the user. (body params) (required)
     * @apiParam {string} lastName lastName of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} mobileNumber mobileNumber of the user. (body params) (required)
     * @apiParam {string} countryCode countryCode of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User created",
            "status": 200,
            "data": {
                "mobileNumber":".........",
                "email":"..........",
                "lastName":".........",
                "firstName":"............"
            }

        }
         * @apiErrorExample {object} Error-Response:
         {
            "error": true,
            "message": "User Already Present With this Email or Mobile Number",
            "status": 400,
            "data": null

        }
    */


    app.post(`${baseUrl}/login`, userController.loginFunction);
    /**
     * @apiGroup auth
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "...............",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
         * @apiErrorExample {object} Error-Response:
         {
            "error": true,
            "message": "Login Failed",
            "status": 400,
            "data": null    

        }
    */

   app.get(`${baseUrl}/getAllUserByLimit`, auth.isAuthorized,userController.getAllUserByLimit);

/**
     * @apiGroup dashboard
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/getAllUserByLimit api for get user data with limit.
     *
     * @apiParam {string} skip skip of the data user. (query params) (required)
     * @apiParam {string} limit: no of data required. (body params) (required)
     * @apiParam {string} authToken: auth token. (query params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All User Details Found",
            "status": 200,
            "data": {
                "role": "...............",
                "countryCode": "...............",
                "mobileNumber": "...............",
                "email": "...............",
                "firstName": "...............",
                "lastName": "...............",
                "userId": "...............",
            }
        }
         * @apiErrorExample {object} Error-Response:
         {
            "error": true,
            "message": "No users Found",
            "status": 400,
            "data": null    

        }
    */
   app.post(`${baseUrl}/getUserAllMeeting`,  auth.isAuthorized,MeetingController.getUserAllMeeting);
   
/**
     * @apiGroup dashboard
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/getAllUserByLimit api for get user data with limit.
     *
     * @apiParam {string} skip skip of the data user. (query params) (required)
     * @apiParam {string} limit: no of data required. (query params) (required)
     * @apiParam {string} authToken: auth token. (query params) (required)
     *  @apiParam {string} userId: userId for get all meeting of user. (post params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All Meeting Found",
            "status": 200,
            "data": [{
                "meetingTitle": "...............",
                "meetingStartTimeSecond": "...............",
                "meetingStartTimeFrame": "...............",
                "meetingStartTimeHour": "...............",
                "metingEndTimeHour": "...............",
                "metingEndTimeSecond": "...............",
                "meetingEndTimeFrame": "...............",
                "meetingLocation": "...............",
                "meetingDescription": "...............",
            }]
        }
         * @apiErrorExample {object} Error-Response:
         {
            "error": true,
            "message": "All Meeting Found",
            "status": 400,
            "data": null    

        }
    */

   app.post(`${baseUrl}/createMeeting`, auth.isAuthorized, MeetingController.generateMeeting);
      
/**
     * @apiGroup dashboard
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/createMeeting api for create meeting .
     * @apiParam {string} authToken: auth token. (query params) (required)
     * @apiParam {string} meetingTitle meetingTitle of the meeting. (post params) (required)
     * @apiParam {string} meetingDate: meetingDate  of the meeting. (post params) (required)
     * @apiParam {string} meetingStartTimeHour meetingStartTimeHour of the meeting. (post params) (required)
     * @apiParam {string} meetingStartTimeSecond: meetingStartTimeSecond  of the meeting. (post params) (required)
     
     * @apiParam {string} meetingStartTimeFrame: meetingStartTimeFrame  of the meeting. (post params) (required)
     * @apiParam {string} metingEndTimeHour: metingEndTimeHour  of the meeting. (post params) (required)
     * 
     *  @apiParam {string} metingEndTimeSecond: metingEndTimeSecond  of the meeting. (post params) (required)
     * @apiParam {string} meetingEndTimeFrame: meetingEndTimeFrame  of the meeting. (post params) (required)
     * 
     * @apiParam {string} meetingDescription: meetingDescription  of the meeting. (post params) (required)
     * @apiParam {string} meetingLocation: meetingLocation  of the meeting. (post params) (required)
     * @apiParam {string} meetingUserId: meetingUserId  of the meeting. (post params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Meeting created",
            "status": 200,
            "data": {
                "meetingTitle": "...............",
                "meetingStartTimeSecond": "...............",
                "meetingStartTimeFrame": "...............",
                "meetingStartTimeHour": "...............",
                "metingEndTimeHour": "...............",
                "metingEndTimeSecond": "...............",
                "meetingEndTimeFrame": "...............",
                "meetingLocation": "...............",
                "meetingDescription": "...............",
            }
        }
         * @apiErrorExample {object} Error-Response:
         {
            "error": true,
            "message": "Meeting Not Created",
            "status": 400,
            "data": null    

        }
    */ 


   app.post(`${baseUrl}/updateMeeting/:meetingId`, auth.isAuthorized, MeetingController.updateMeeting);
      
   /**
        * @apiGroup dashboard
        * @apiVersion  1.0.0
        * @api {post} /users/updateMeeting/:meetingId api for update meeting .
        * @apiParam {string} authToken: auth token. (query params) (required)
        * @apiParam {string} meetingTitle meetingTitle of the meeting. (post params) (required)
        * @apiParam {string} meetingDate: meetingDate  of the meeting. (body params) (required)
        * @apiParam {string} meetingStartTimeHour meetingStartTimeHour of the meeting. (body params) (required)
        * @apiParam {string} meetingStartTimeSecond: meetingStartTimeSecond  of the meeting. (body params) (required)
        
        * @apiParam {string} meetingStartTimeFrame: meetingStartTimeFrame  of the meeting. (post params) (required)
        * @apiParam {string} metingEndTimeHour: metingEndTimeHour  of the meeting. (post params) (required)
        * 
        *  @apiParam {string} metingEndTimeSecond: metingEndTimeSecond  of the meeting. (post params) (required)
        * @apiParam {string} meetingEndTimeFrame: meetingEndTimeFrame  of the meeting. (post params) (required)
        * 
        * @apiParam {string} meetingDescription: meetingDescription  of the meeting. (post params) (required)
        * @apiParam {string} meetingLocation: meetingLocation  of the meeting. (post params) (required)
        * @apiParam {string} /:meetingId: meetingId  of the meeting. (url params) (required)
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
               "error": false,
               "message": "Meeting updated",
               "status": 200,
               "data": {
                   "meetingTitle": "...............",
                   "meetingStartTimeSecond": "...............",
                   "meetingStartTimeFrame": "...............",
                   "meetingStartTimeHour": "...............",
                   "metingEndTimeHour": "...............",
                   "metingEndTimeSecond": "...............",
                   "meetingEndTimeFrame": "...............",
                   "meetingLocation": "...............",
                   "meetingDescription": "...............",
               }
           }
            * @apiErrorExample {object} Error-Response:
            {
               "error": true,
               "message": "Meeting Not updated",
               "status": 400,
               "data": null    
   
           }
       */ 
   


   app.post(`${baseUrl}/deleteMeeting`, auth.isAuthorized, MeetingController.deleteMeeting); 
    
     /**
        * @apiGroup dashboard
        * @apiVersion  1.0.0
        * @api {post} /api/v1/users/deleteMeeting api for delete meeting .
        * @apiParam {string} authToken: auth token. (query params) (required)
        *  @apiParam {string} meetingId: meetingId. (post params) (required)
        *  @apiParam {string} userId: userId. (post params) (optional)
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
               "error": false,
               "message": "Meeting deleted successfully",
               "status": 200,
               "data": null
           }
            * @apiErrorExample {object} Error-Response:
            {
               "error": true,
               "message": "Meeting Not deleted",
               "status": 400,
               "data": null    
   
           }
       */ 
  app.post(`${baseUrl}/getTodayMeetingsForSnooze`,auth.isAuthorized, MeetingController.getTodayMeetingsForSnooze);  
      
     /**
        * @apiGroup dashboard
        * @apiVersion  1.0.0
        * @api {post} /api/v1/users/getTodayMeetingsForSnooze api for get snoozed meeting detail .
        * @apiParam {string} authToken: auth token. (query params) (required)
      
        *  @apiParam {string} meetingUserId: userId. (post params) (optional)
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
               "error": false,
               "message": "Meeting Found Successfully",
               "status": 200,
               "data": []//array of record
           }
            * @apiErrorExample {object} Error-Response:
            {
               "error": true,
               "message": "Meeting Not Get",
               "status": 400,
               "data": null    
   
           }
       */ 
  app.post(`${baseUrl}/updateMeetingSnooze`,auth.isAuthorized, MeetingController.updateMeetingSnooze); 
     /**
        * @apiGroup dashboard
        * @apiVersion  1.0.0
        * @api {post} /api/v1/users/updateMeetingSnooze api for updating on server to get dissmiss for snooze .
        * @apiParam {string} authToken: auth token. (query params) (required)
      
        *  @apiParam {string} meetingId: meetingId. (post params) (optional)
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
               "error": false,
               "message": "Meeting snooze Updated successfully",
               "status": 200,
               "data": []//array of record
           }
            * @apiErrorExample {object} Error-Response:
            {
               "error": true,
               "message": "Meeting Not Updated",
               "status": 400,
               "data": null    
   
           }
       */ 

    
   app.put(`${baseUrl}/:userId/edit`, auth.isAuthorized, userController.editUser);

  app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);

  app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);
     //sdssdasdasd
     




    
       
 



}
