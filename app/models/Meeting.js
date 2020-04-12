'use strict'
/**
 * Module Dependencies
 */
const timeLib = require("../libs/timeLib");
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MeetingSchema = new Schema({
  meetingId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  meetingTitle: {
    type: String,
    default: ''
  },
  meetingDate: {
    type: Object,
  },
  meetingStartTimeHour: {
    type: Number,
  },
  meetingStartTimeSecond: {
    type: Number,
    default: ''
  },
  meetingStartTimeFrame: {
    type: String,
    default: ''
  },
  metingEndTimeHour: {
    type: Number,
    default: ''
  },
  metingEndTimeSecond: {
    type: Number,
    default: ''
  },
 
  meetingEndTimeFrame: {
    type: String,
    default: ''
  },
  meetingDescription: {
    type: String,
    default: ''
  },
  meetingLocation: {
    type: String,
    default: ''
  },
  meetingUserId: {
    type: String,
  },
  createdBy:{
    type: String,
  },
  snooze:{
    type:Boolean,
    default:true
  },
  createdAt:{
    type:Date,
    default:timeLib.now()
  },
  updatedAt:{
      type:Date,
      default:timeLib.now()
  }


})


mongoose.model('Meeting', MeetingSchema);