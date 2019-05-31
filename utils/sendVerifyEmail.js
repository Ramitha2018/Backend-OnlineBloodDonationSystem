const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();


/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/

const smtpTransport = nodemailer.createTransport(({
    host: process.env.SMTP_HOST,
    port: process.env.SWTP_PORT,
    secure: true,
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

    const rand = Math.floor((Math.random() * 100) + 54);            // generating a random number
    const host = req.headers.host;
    const mail = req.body.email.toLowerCase();
    const link = "http://"+host+"/verify?id="+rand+'&mail='+req.body.email;
    const mailOptions={
        from : process.env.SMTP_USER,
        to : req.body.email.toLowerCase(),
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the Button to verify your email.<br><form method= \"post\" action="+link+" class=\"inline\">\n" +
        "  <input type=\"hidden\" name=\"extra_submit_param\" value=\"extra_submit_value\">\n" +
        "  <button type=\"submit\" name=\"submit_param\" value=\"submit_value\" class=\"link-button\">\n" +
        "    The Button\n" +
        "  </button>\n" +
        "</form>"
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