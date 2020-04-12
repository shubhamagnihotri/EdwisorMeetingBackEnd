const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const events = require('events');

// const eventEmitter = new events.EventEmitter();

const tokenLib = require('./tokenLib.js');
const check = require('./checkLib.js');

const response = require('./responseLib.js');

const mailLib = require('./mailLib.js');

let setServer =(server)=>{
    const io = socketio.listen(server);
    const myIo = io.of('');
    let allOnlineUsers = [];

    myIo.on('connection',function(socket){
        socket.emit('verifyUser');

        socket.on('set-user',(authToken)=>{
          
            tokenLib.verifyClaimWithoutSecret(authToken,function(err,decodedData){
                if(err){
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' });
                }else{
                    console.log('decoded');
                    socket.userId = decodedData.data.userId;
                   // socket.emit(decodedData.f.userId,decodedData);
                    let usersObj = {userId:decodedData.data.userId,fullName:`${decodedData.data.firstName} ${decodedData.data.lastName}`};
                    allOnlineUsers.push(usersObj);
                    myIo.emit('online-user-list',allOnlineUsers)

                    socket.on('meeting-updated',(data)=>{
                        console.log('meeting up'+data.userId);
                        let a=allOnlineUsers.some(res=>res.userId = data.userId);
                        if(a){
                            myIo.emit(data.userId,data);
                        }
                     
                        // eventEmitter.emit('sendMeetingUpdateMail',{})
                    })
            
                    // socket.room = "meetingRoom"
                    // socket.join(socket.room)
                    // socket.to(socket.room).broadcast.emit("online-user-list",allOnlineUsers)
                    // console.log(allOnlineUsers);
                }
            })

        })

        // eventEmitter.on('sendMeetingUpdateMail',(data)=>{
        //     // console.log("emit Message sent: 1");
        //     mailLib.sendEmail(data);
        // })  


      
        socket.on('disconnect', ()=>{

            let removeIndex = allOnlineUsers.map((users)=>{ return users.userId }).indexOf(socket.userId);

            console.log("socket is dissconnected "+socket.userId+" "+removeIndex);
            allOnlineUsers.splice(removeIndex,1);
            console.log(allOnlineUsers);
            myIo.emit('online-user-list',allOnlineUsers)
            socket.conn.close();
           
            // socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers);
            // socket.leave(socket.room);
            
        });

        // socket.on('typing',(fullname)=>{
        //     console.log(fullname);
        //     socket.to(socket.room).broadcast.emit('typing',fullname)
        // })

        // socket.on('chat-msg',(data)=>{
        //     console.log("chat msg called on server from"+data.senderName+" to "+data.receiverName)
        //     myIo.emit(data.receiverId,data)
        // })

    });
}


module.exports= {
    setServer:setServer
}