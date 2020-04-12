const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
const response = require('./responseLib')

const redisLib = require('./redisLib.js');

let setServer =(server)=>{

    let io = socketio.listen(server);
    let myIo = io.of('/online-user');
    myIo.on('connection',(socket)=>{
        console.log("on connection--emitting verify user");
        socket.emit('verify-user',"");

        socket.on('set-user',(authToken)=>{
            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken,(err,user)=>{
                if(err){
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }else{
                    let currentUser = user.data;
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    let setUserOnline = redisLib.setANewOnlineUserInHash('onlineUsers',key,fullName,(err,result)=>{
                        if(err){
                            console.log(`some error occurred`)
                        }else{
                            redisLib.getAllUsersInAHash('onlineUsers',(err, result)=>{
                                console.log(`--- inside getAllUsersInAHas function ---`)
                                if(err){
                                    console.log(err)
                                }else{
                                       
                                    console.log(`${fullName} is online`);
                                    socket.room = 'meetingRoom';
                                    socket.join(socket.room)
                                            .to(socket.room).broadcast.emit('online-user-list', result) 
                                }
                            })
                        }
                    })
                }
            })
        })// set user ended

        socket.on('disconnect',()=>{
            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);
            if(socket.userId){
                redisLib.deleteUserFromHash('onlineUsers', socket.userId);
                redisLib.getAllUsersInAHash('onlineUsers',(err,result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        socket.leave(socket.room);
                        socket.to(socket.room).broadcast.emit('online-user-list', result) 
                    }
                })
            }
        })

    })

}



module.exports= {
    setServer:setServer
}