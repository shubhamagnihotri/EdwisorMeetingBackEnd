const check = require("./checkLib.js");
const redis = require('redis');
let client = redis.createClient();

client.on('connect',()=>{
    console.log('Redis connection opened ');
})

let setANewOnlineUserInHash =(hashName,key,value,cb)=>{
    client.HMSET(hashName,[
        key, value
    ],(err, result) => {
        if (err) {
            console.log(err);
            cb(err, null)
        } else {

            console.log("user has been set in the hash map");
            console.log(result)
            cb(null, result)
        }
    })
}

let getAllUsersInAHash = (hashName, callback) => {
    client.HGETALL(hashName, (err, result) => {
        if(err){
            callback(err, null)
        }else if(check.isEmpty(result)){
            callback(null, {})
        }else{
            callback(null, result)
        }
    })
}


let deleteUserFromHash = (hashName,key)=>{

    client.HDEL(hashName,key);
    return true;

}// end delete user from hash

module.exports = {
    getAllUsersInAHash:getAllUsersInAHash,
    setANewOnlineUserInHash:setANewOnlineUserInHash,
    deleteUserFromHash:deleteUserFromHash
}
