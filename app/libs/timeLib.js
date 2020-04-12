const moment = require('moment')
const momenttz = require('moment-timezone')
const timeZone = 'Asia/Calcutta'
let now = () => {
  return moment.utc().format()
}

let getLocalTime = () => {
  return moment().tz(timeZone).format()
}

let convertToLocalTime = (time) => {
  return momenttz.tz(time, timeZone).format('LLLL')
}

let getCurrentTimeFOrTimeDifference=()=>{
  return moment().format('MM/DD/YYYY h:mm a'); 
}
module.exports = {
  now: now,
  getLocalTime: getLocalTime,
  convertToLocalTime: convertToLocalTime,
  getCurrentTimeFOrTimeDifference:getCurrentTimeFOrTimeDifference
}