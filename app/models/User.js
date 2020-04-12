'use strict'
/**
 * Module Dependencies
 */
const timeLib = require("../libs/timeLib");
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: 'passskdajakdjkadsj'
  },
  email: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: Number,
    default: 0
  },
  countryCode:{
    type: String,
    default: ''
  },
  role:{
    type:String,
    default:'user'
    // user or admin
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


mongoose.model('User', userSchema);