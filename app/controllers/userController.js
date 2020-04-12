const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const AuthModel = mongoose.model('Auth')
const { Validator } = require('node-input-validator');
/* Models */
const UserModel = mongoose.model('User')
const OtpModel = mongoose.model('Otp')
const mailLib = require("../libs/mailLib");

const events = require('events');
const eventEmitter = new events.EventEmitter();

/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users


let getAllUserByLimit=(req,res)=>{
   
    UserModel.find({role:"user"})
             .skip(parseInt(req.query.skip))
             .limit(parseInt(req.query.limit))
             .select(' -__v -_id -password')
            .lean()
            .exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller: getAllUser', 10)
                    let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller: getAllUser')
                    let apiResponse = response.generate(true, 'No User Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                    res.send(apiResponse)
                }
            })

}



/* Get single user details */
let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user



let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user

let editUser = (req, res) => {

    let options = req.body;
    UserModel.update({ 'userId': req.params.userId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    });// end user model update


}// end edit user


// start user signup function 

let signUpFunction = (req, res) => {
    let serverValidation = ()=>{
        return new Promise((resolve,reject)=>{
            
            const v = new Validator(req.body, {
                firstName:'required',
                lastName: 'required',
                password:'required',
                email:'required',
                mobileNumber:'required',
                countryCode:'required'
                
            });
            v.check().then((matched)=>{
                if(!matched){
                    let apiResponse = response.generate(true,'validation Errors',400,v.errors);
                    reject(apiResponse)
                }else{
                  
                    resolve(req)
                }
            });
        })
    }// end validate user input

    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne(
                { 
                    $or:[{email: req.body.email},{mobileNumber:req.body.mobileNumber}]
                }).exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (!retrievedUserDetails || !Object.keys(retrievedUserDetails).length) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            countryCode:req.body.countryCode,
                            password: passwordLib.hashpassword(req.body.password.trim()),
                            createdOn: time.now()
                        })
                        if(req.body.role && req.user && req.user.userType =='admin' && (req.body.role == 'admin' || req.body.role =='user')){
                            newUser.role = req.body.role;
                        }
                        
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email or Mobile Number', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    serverValidation(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {

    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email}, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 500, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 200, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    tokenDetails.userDetails._token =  tokenDetails.token;
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            delete tokenDetails.userId;
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            delete tokenDetails.userId;
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req,res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}
// end of the login function 



let OtpGenrateForForgetPassword =(req, res)=>{
    if(!req.body.email){
        let apiResponse = response.generate(true, 'Please Provide Mail Id', 500, null)
        res.send(apiResponse);
    }

    let userExist =()=>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({email:req.body.email}).select('userId email firstName lastName')
            .lean()
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'User Controller: get user exist', 10)
                    let apiResponse = response.generate(true, 'Failed To Find User', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller:getSingleUser')
                    let apiResponse = response.generate(true, 'No User Exist with thips mail Id', 404, null)
                    reject(apiResponse)
                } else {
                  
                    resolve(result);
                }
            })
        })
    }

    let generateOtp =(userDetails)=>{
       
        return new Promise((resolve,reject)=>{
            OtpModel.findOne({userId:userDetails.userId},(err, otpDetails)=>{
                if(err){
                    let apiResponse = response.generate(true, 'Failed To Generate Otp', 500, null)
                    console.log('11111111');
                    reject(apiResponse)
                }else if(check.isEmpty(otpDetails)){
                    let newOtp = new OtpModel({
                        otpId:shortid.generate(),
                        userId:userDetails.userId,
                        email:userDetails.email,
                        otp:shortid.generate()
                    })
                    newOtp.save((err,newOtpdetails)=>{
                        if(err){
                            let apiResponse = response.generate(true, 'Failed To Generate Otp', 500, null)
                     
                            reject(apiResponse)
                        }else{
                            let maildata ={ 
                                email:userDetails.email,
                                subject:`Otp for Chnange password for Meeting Planner`,
                                text:`Hello ${userDetails.email} Your Otp for forget password`,
                                html:`<b>${newOtpdetails.otp}</b>`
                            }
                            console.log(maildata);
                            setTimeout(()=>{
                                eventEmitter.emit('otp-for-forgetPwd',maildata)
                            },1000) 
                        //   delete newOtpdetails.otp;
                        //   delete newOtpdetails.otpId;
                        //   delete newOtpdetails._id;
                        //   delete newOtpdetails.tokenGenerationTime;
                            resolve(newOtpdetails.toObject())
                        }
                    })
                }else{
                    otpDetails.otp = shortid.generate();
                    otpDetails.save((err,newOtpDetail)=>{
                        if(err){
                            let apiResponse = response.generate(true, 'Failed To Generate Otp', 500, null)
                            reject(apiResponse)
                        }else{
                            let maildata ={ 
                                email:userDetails.email,
                                subject:`Otp for Chnange password for Meeting Planner`,
                                text:`Hello ${userDetails.email} Your Otp for forget password`,
                                html:`<b>${newOtpDetail.otp}</b>`
                            }
                            console.log(maildata);
                            setTimeout(()=>{
                                eventEmitter.emit('otp-for-forgetPwd',maildata)
                            },1000) 
                            // delete newOtpDetail.otp;
                            // delete newOtpDetail.otpId;
                            // delete newOtpDetail._id;
                            // delete newOtpDetail.tokenGenerationTime;
                            resolve(newOtpDetail.toObject());
                        }
                    })
                }
            })
        })
    }
    userExist(req,res)
            .then(generateOtp)
            .then((resolve)=>{
                delete resolve.otp;
                delete resolve.otpId;
                delete resolve.userId;
                delete resolve.otpId;
                delete resolve._id;
                let apiResponse = response.generate(false, 'Otp Generated', 200, resolve);
              
                res.status(200)
                res.send(apiResponse)
            })
            .catch((err)=>{
                res.status(err.status)
                res.send(err)
            })
}

let OtpValidateForForgetPassword =(req,res)=>{

    let serverValidation =()=>{
        return new Promise((resolve,reject)=>{
            const v = new Validator(req.body, {
                email:'required',
                otp:'required',
                password: 'required',
            });
            v.check().then((matched)=>{
                if(!matched){
                    let apiResponse = response.generate(true,'validation Errors',400,v.errors);
                    reject(apiResponse)
                }else{
                    resolve(req);
                }
            });
        })
    }// end servervalidtaion

    let ValidateOtp =()=>{
        return new Promise((resolve,reject)=>{
            OtpModel.findOne({email:req.body.email}, (err, otpRowDetail) =>{
                if(err){
                    let apiResponse = response.generate(true, 'Failed To validate otp', 500, null)
                    reject(apiResponse)
                }else if(check.isEmpty(otpRowDetail)){
                    let apiResponse = response.generate(true, 'Otp Not Found', 404, null)
                    reject(apiResponse)
                }else{
                    if(otpRowDetail.otp == req.body.otp){
                        resolve(otpRowDetail);
                    }else{
                        let apiResponse = response.generate(true, 'Otp Not Matched', 404, null)
                        reject(apiResponse)
                    }
                   
                }
            } )
        })
    }

    let changePassword =(userotpRowDetail)=>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({userId:userotpRowDetail.userId},(err, retrieveUserDetail) => {
                if(err){
                    let apiResponse = response.generate(true, 'Falied to change password', 500, null)
                    reject(apiResponse)
                }else if(check.isEmpty(retrieveUserDetail)){
                    let apiResponse = response.generate(true, 'No User Exist', 404, null)
                    reject(apiResponse)      
                }else{
                    let newPwd= passwordLib.hashpassword(req.body.password.trim())
                    let UpdatedOption = {password:newPwd}
                    UserModel.update({userId:retrieveUserDetail.userId},UpdatedOption).exec((err, result) => {
                        if(err){
                            let apiResponse = response.generate(true, 'Falied to update password', 500, null) 
                            reject(apiResponse);
                        }else{  
                            resolve(result)
                        }
                    })
                }
            })  
        })
    }

    serverValidation(req,res)
                    .then(ValidateOtp)
                    .then(changePassword)
                    .then((resolve)=>{
                        let apiResponse = response.generate(false,'Password Updated', 200, resolve);
                        console.log("meet success");
                        res.status(200);
                        res.send(apiResponse)
                    }).catch((err) => {
                        console.log("errorhandler");
                        res.status(err.status)
                        res.send(err)
                    })

}



/**
 * function to logout user.
 * auth params: userId.
 */
let logout = (req, res) => {
  AuthModel.findOneAndRemove({userId: req.user.userId}, (err, result) => {
    if (err) {
        console.log(err)
        logger.error(err.message, 'user Controller: logout', 10)
        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
        res.send(apiResponse)
    } else if (check.isEmpty(result)) {
        let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
        res.send(apiResponse)
    } else {
        let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
        res.send(apiResponse)
    }
  })
} // end of the logout function.

eventEmitter.on('otp-for-forgetPwd',(data)=>{
    console.log(data);
    mailLib.sendEmail(data)
})



module.exports = {

    signUpFunction: signUpFunction,
    getAllUser: getAllUser,
    getAllUserByLimit:getAllUserByLimit,
    editUser: editUser,
    deleteUser: deleteUser,
    getSingleUser: getSingleUser,
    loginFunction: loginFunction,
    OtpGenrateForForgetPassword:OtpGenrateForForgetPassword,
    OtpValidateForForgetPassword:OtpValidateForForgetPassword,
    logout: logout

}// end exports