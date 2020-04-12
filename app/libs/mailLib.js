"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    //host: "smtp.ethereal.email",
    //port: 587,
    //secure: false, // true for 465, false for other ports
    service:'gmail',
    auth: {
      user: "nicspprt@gmail.com", // generated ethereal user
      pass:"DA#ba<P!*]dp5]dI" // generated ethereal password
    }
});

let sendEmail =(data)=>{
    // console.log("emit Message sent: %s");
    let info = {
        from: 'nicspprt@gmail.com', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html:  data.html // html body
      };
      console.log()
    transporter.sendMail(info,function(err,info){
        if(err){
            console.log(err);
        }else{
            console.log(info);
        }
        
    //   console.log("Message sent: %s", info.messageId);
    //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });

    
}

module.exports={
    sendEmail:sendEmail
}
