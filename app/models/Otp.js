const mongoose = require('mongoose')
const Schema = mongoose.Schema
const time = require('../libs/timeLib')

const Otp = new Schema({
  otpId: {
    type: String
  },
  userId: {
    type: String
  },
  email: {
    type: String
  },
  otp:{
    type:String
  },
  tokenGenerationTime: {
    type: Date,
    default: time.now()
  }
})

module.exports = mongoose.model('Otp', Otp)
