const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();


/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/

const smtpTransport = nodemailer.createTransport(({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
}));


/*------------------SMTP Over-----------------------------*/

module.exports = async function send(req,res){

    console.log('did it get here?');

    var rand = Math.floor((Math.random() * 100) + 54);            // generating a random number
    var host = req.headers.host;
    var mail = req.body.email;
    var link = "http://"+host+"/verify?id="+rand+'&mail='+req.body.email;
    var mailOptions={
        from : process.env.SMTP_USER,
        to : req.body.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    };

    console.log(mailOptions);

    try {
        x = await smtpTransport.sendMail(mailOptions);
        return rand;

    }catch(error){
        console.log('this error?');
        console.log(error);
        throw error;
    }
};