const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const mailLib = require('../libs/mailLib');
const AuthModel = mongoose.model('Auth');

const { Validator } = require('node-input-validator');
/* Models */
const UserModel = mongoose.model('User')
const MeetingModel = mongoose.model('Meeting')

const events = require('events');
const eventEmitter = new events.EventEmitter();


// start create meeting function 

let meetingController = {};

meetingController.generateMeeting =(req,res)=>{

    let serverValidation =()=>{
        return new Promise((resolve,reject)=>{
            const v = new Validator(req.body, {
                meetingTitle:'required',
                meetingDate: 'required',
                // meetingStartTime:'required',
                meetingStartTimeHour:'required',
                meetingStartTimeSecond:'required',
                meetingStartTimeFrame:'required',
                metingEndTimeHour:'required',
                metingEndTimeSecond:'required',
                meetingEndTimeFrame:'required',
                meetingDescription:'required',
                meetingLocation:'required',
                meetingUserId:'required'
                
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

    let createMeeting = ()=>{
        return new Promise((resolve,reject)=>{
           let meeting = new MeetingModel({
            meetingId:shortid.generate(),
            meetingTitle:req.body.meetingTitle,
            meetingDate: req.body.meetingDate,
          
            meetingStartTimeHour:req.body.meetingStartTimeHour,
            meetingStartTimeSecond:req.body.meetingStartTimeSecond,
            meetingStartTimeFrame:req.body.meetingStartTimeFrame,
            metingEndTimeHour:req.body.metingEndTimeHour,
            metingEndTimeSecond:req.body.metingEndTimeSecond,
            meetingEndTimeFrame:req.body.meetingEndTimeFrame,
            meetingDescription:req.body.meetingDescription,
            meetingLocation:req.body.meetingLocation,
            meetingUserId:req.body.meetingUserId,
            createdBy:req.user.name
           });
           meeting.save((err,newMeeting)=>{
               if(err){
              
                    logger.error(err.message, 'MeetingController: Create Meeting', 10)
                    let apiResponse = response.generate(true, 'Failed to create Meeting', 500, null)
                    reject(apiResponse)
               }else{
                let newUserObj = newMeeting.toObject();
                console.log(newMeeting);
                    resolve(newUserObj);
               }
           })
        })
    }// create Prmoise Meeting function ended 

    serverValidation(req,res)
                    .then(createMeeting)
                    .then((resolve)=>{
                        let apiResponse = response.generate(false,'Meeting created', 200, resolve);
                        let meetingData = {meetingUserId:req.body.meetingUserId,meetingTitle:req.body.meetingTitle,
                            meetingDate:req.body.meetingDate,flag:'create',email:""};
                           setTimeout(()=>{
                             eventEmitter.emit('meeting-update-mail-notification',meetingData)
                           },2000) 
                        
                        console.log(apiResponse);
                        res.status(200)
                        res.send(apiResponse)
                    }).catch((err) => {
                        console.log(err);
                        res.send(err);
                    })
     
    // call all promise function       

}
// end generateMeeting ended

meetingController.getUserAllMeeting =(req,res)=>{
    if(!req.body.userId && !req.body.meetingId){
        let apiResponse = response.generate(true, 'Please Prvide user id or meeting id', 404, null)
        res.send(apiResponse)
    }
    var meetingMod;
    if(req.body.meetingId){
         meetingMod = MeetingModel.findOne({meetingId:req.body.meetingId})
        //get meeting by meeting id
    }else{
         meetingMod = MeetingModel.find({meetingUserId:req.body.userId})
        //get user all meeting 
    }
    
    meetingMod.select(' -__v -_id')
    .lean()
    .exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Meeting: getAllUser', 10)
            let apiResponse = response.generate(true, 'Failed To Find Meeting Details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Meeting Found', 'Meeting Controller: getUserAllMeeting')
            let apiResponse = response.generate(true, 'No Meeting Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Meeting Found', 200, result)
            res.send(apiResponse)
        }
    })
}
// end geteMeeting ended

meetingController.updateMeeting =(req,res)=>{
    let serverValidation =()=>{
        return new Promise((resolve,reject)=>{
            const v = new Validator(req.body, {
                meetingId:'required',
                meetingTitle:'required',
                meetingDate: 'required',
                // meetingStartTime:'required',
                meetingStartTimeHour:'required',
                meetingStartTimeSecond:'required',
                meetingStartTimeFrame:'required',
                metingEndTimeHour:'required',
                metingEndTimeSecond:'required',
                meetingEndTimeFrame:'required',
                meetingDescription:'required',
                meetingLocation:'required',
                // meetingUserId:'required'
                
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

    let updateMeeting =()=>{
        return new Promise((resolve,reject)=>{
            let options = req.body;
            options.createdBy = req.user.name;
            options.snooze = true;
            MeetingModel.update({ 'meetingId': req.params.meetingId }, options).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Meeting Controller:editUser', 10)
                    let apiResponse = response.generate(true, 'Failed To edit Meeting details', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Meeting Found', 'Meeting Controller: editMeeting')
                    let apiResponse = response.generate(true, 'No Meeting Found', 404, null)
                 
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Meeting details edited', 200, result)
                    resolve(apiResponse)
                }
            });// end user model update
        })
    }

    serverValidation(req,res)
    .then(updateMeeting)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'Meeting updated', 200, resolve)
        console.log(apiResponse);
        let meetingData = {meetingId:req.params.meetingId,meetingTitle:req.body.meetingTitle,
            meetingDate:req.body.meetingDate,flag:'update',email:""};
           setTimeout(()=>{
             eventEmitter.emit('meeting-update-mail-notification',meetingData)
           },2000); 
        res.status(200)
        res.send(apiResponse)
    }).catch((err) => {
        console.log(err);
        res.send(err);
    })
}

meetingController.deleteMeeting =(req,res)=>{
    if(!req.body.meetingId){
        let apiResponse = response.generate(true, 'No Data Found', 404, null)
        res.send(apiResponse)
    }
   
    MeetingModel.findOneAndRemove({meetingId: req.body.meetingId}, (err, result) => {
          if (err) {
              console.log(err)
              logger.error(err.message, 'Meeting  Controller: logout', 10)
              let apiResponse = response.generate(true, `error occurred`, 500, null)
              res.send(apiResponse)
          } else if (check.isEmpty(result)) {
              let apiResponse = response.generate(true, 'No meeting exist', 404, null)
              res.send(apiResponse)
          } else {
            let meetingData = {meetingId:req.body.meetingId,meetingTitle:"",
                meetingDate:"",flag:'delete',email:"",userId:req.body.userId};
                console.log(meetingData);
               setTimeout(()=>{
                 eventEmitter.emit('meeting-update-mail-notification',meetingData)
               },2000); 
               res.status(200)
              let apiResponse = response.generate(false, 'Meeting deleted successfully', 200, null)
              res.send(apiResponse)
          }
    })
    // end of the logout function.
      
}

meetingController.getTodayMeetingsForSnooze =(req,res)=>{
    if(!req.body.meetingUserId){
        let apiResponse = response.generate(true, 'No Data Found', 404, null)
        res.send(apiResponse)
    }
    let todayDate =new Date();
 
    let todayDateSS = time.getCurrentTimeFOrTimeDifference()
    let miliSecond = new Date(todayDateSS).getTime()
    let userId = req.body.meetingUserId;
    MeetingModel.find({meetingUserId:userId,snooze:true})
                .select('meetingTitle meetingId meetingDate meetingUserId meetingStartTimeHour meetingStartTimeSecond meetingStartTimeFrame snooze createdBy')
                .lean()
                .exec((err, result) => {
               
                    if(err){
                        let apiResponse =  response.generate(false, 'Failed to get snoozed Meeting', 500, filterdata)
                        console.log(apiResponse);
                    }else if(check.isEmpty(result)){
                        let apiResponse =  response.generate(false, 'No meeting Found for snooze', 404, filterdata)
                        console.log(apiResponse);
                    }else{
                    
                    let meetingResult = result;
                    var filterdata= []
                     meetingResult.forEach((res)=>{
                      let dateObj = new Date(res.meetingDate)
                        if(todayDate.getMonth() == dateObj.getMonth() && todayDate.getFullYear()== dateObj.getFullYear()
                        && todayDate.getDate() == dateObj.getDate()){
                           
                            let timeFrame = `${res.meetingStartTimeHour}:${res.meetingStartTimeSecond}:${res.meetingStartTimeFrame}`;
                        
                            let stringDate = ((dateObj.getMonth()+1)+'/'+dateObj.getDate()+'/'+dateObj.getFullYear()+' '+timeFrame).toString();
                           
                            
                            let dataTimeMs = parseInt(new Date(stringDate).getTime());
                          
                            let sendTime = (dataTimeMs - miliSecond);
                        
                            if(sendTime >=0){
                                let finalTime= sendTime-120000;
                                filterdata.push({
                                    meetingUserId:res.meetingUserId,createdBy:res.createdBy,meetingTitle:res.meetingTitle
                                ,snoozeTime:finalTime,snooze:true,meetingId:res.meetingId});
                                }
                               
                            }
                         })
                         filterdata.sort(function(a, b){return a - b});
                         console.log(filterdata)
                        //  let resmsg =  filterdata.length == 0 ? 'No Meeting For Snooze':'Meeting Found for snooze';
                         if(check.isEmpty(filterdata)){
                             let apiResponse =  response.generate(true, 'No Meeting For Snooze', 400, null);
                             res.send(apiResponse);
                         }else{
                            let apiResponse =  response.generate(false, 'Meeting Found for snooze', 200, filterdata[0]);
                            res.send(apiResponse);
                         }
                        
                    }
                })
}
// end snooze meeting 


meetingController.updateMeetingSnooze =(req,res)=>{
    if(!req.body.meetingId){
        let apiResponse = response.generate(true, 'No Data Found', 404, null)
        res.send(apiResponse)
    }
    MeetingModel.update({meetingId:req.body.meetingId},{snooze:false}).exec((err, result) => {
        if (err) {
            let apiResponse = response.generate(true, 'Failed To update meeting update', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
         
            let apiResponse = response.generate(true, 'No meeting Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Snoozed geeting offed', 200, result)
            res.send(apiResponse)
        }
    })
}

eventEmitter.on('meeting-update-mail-notification',(data)=>{
    console.log('meeting-update-mail-notification');    

    if(data.flag == 'create'){
        UserModel.findOne({userId:data.meetingUserId}).select('userId email firstName lastName')
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'User Controller: getSingleUser', 10)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
               
            } else {
                let sendata = {};
                sendata.email = result.email;
                sendata.subject = "One new Meeting Created";
                sendata.text = data.meetingTitle.toUpperCase()+' Meeting Created';
                sendata.html= `Hello ${result.firstName} ${result.lastName}
                            <b>${data.meetingTitle.toUpperCase()} </b> Meeting Created <br>
                            Meeting Date : ${data.meetingDate}
                            Please Be on Time 
                            Created by Admin`; // html body
                            console.log(sendata);
                mailLib.sendEmail(sendata);
            }
        })
    }
    
    if(data.flag == 'update'){
        console.log(data);
        // let deltedFlag = data.flag =='delete' ?  true:false;
        let findUserId =(data)=>{
            return new Promise((resolve,reject)=>{
                MeetingModel.findOne({meetingId:data.meetingId}).select('meetingUserId')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        logger.error(err.message, 'meeting Controller: getSingleUser', 10)
                        let apiResponse = response.generate(true, 'Failed To get userid of meeting', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(result)) {
                        logger.info('No Meeting Found', 'meeting Controller:getmeeting')
                        let apiResponse = response.generate(true, 'No Meeting Found', 404, null)
                        reject(apiResponse)
                    } else {
                        resolve(result)
                    }
                })
            })
        }

        let UserMail =(userDetail)=>{
            return new Promise((resolve,reject)=>{
                UserModel.findOne({userId:userDetail.meetingUserId}).select('userId email firstName lastName')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        logger.error(err.message, 'User Controller: getSingleUser', 10)
                        let apiResponse = response.generate(true, 'Failed To get userid of meeting', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(result)) {
                        logger.info('No User Found', 'Meeting Controller:getSingleUser')
                    
                        let apiResponse = response.generate(true, 'No Meeting Found', 404, null)
                        reject(apiResponse)
                    } else {
                        resolve(result);
                    }
                })
            })
        }
        findUserId(data)
                .then(UserMail)
                .then((resolve)=>{
                    let sendata = {};
                    sendata.email = resolve.email;
                    sendata.subject = "One Meeting Updated"; 
                    sendata.text =data.meetingTitle.toUpperCase();
                    sendata.text += ' Meeting Updated';
                    // if(deltedFlag){
                    //     sendata.html= `<b>One meeting deleted from admin </b> Meeting Created <br>
                    //     Meeting Date Please go to on portal`; // html body
                    // }else{
                        sendata.html= `<b>${data.meetingTitle.toUpperCase()} </b> Meeting Created <br>
                        Meeting Date : ${data.meetingDate} Please Be on Time Updated by Admin`; // html body
                       
                    // }
                    console.log(sendata);
                    mailLib.sendEmail(sendata);
                }).catch((err)=>{
                    console.log(err);
                })
    }

    if(data.flag == 'delete'){
        UserModel.findOne({userId:data.userId}).select('userId email firstName lastName')
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'User Controller: getSingleUser', 10)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Meeting Controller:getSingleUser')
            } else {
                let sendata = {};
                sendata.email = result.email;
                sendata.subject = "One Meeting Deleted"; 
              
                sendata.text = 'One Meeting Updated';
              
                    sendata.html= `Hello ${result.firstName}
                    <b>One meeting deleted from admin </b> <br>
                     Please go to on portal`; // html body
               
                console.log(sendata);
                mailLib.sendEmail(sendata);
            }
        })
    }

    


})

module.exports ={
    generateMeeting:meetingController.generateMeeting,
    getUserAllMeeting:meetingController.getUserAllMeeting,
    updateMeeting:meetingController.updateMeeting,
    deleteMeeting:meetingController.deleteMeeting,
    getTodayMeetingsForSnooze:meetingController.getTodayMeetingsForSnooze,
    updateMeetingSnooze:meetingController.updateMeetingSnooze
}
