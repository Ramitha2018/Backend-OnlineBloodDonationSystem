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

module.exports = async function send(req){
    const host = req.headers.host;
    const link = "http://"+host+"/search";
    let mailOption = {
        from : process.env.SMTP_USER,
        to : req.body.reqmail,
        subject : "We Have a matching donor for your request",
        html : 'Hello,<br>We have a new donor which matches your search query.<br> Please visit <a href='+link+'>Click here</a> to check it out.<br>p.s. : The availability of the donor may vary depending on his/her preference.'
    }

    console.log(mailOption);

    try {
        x = await smtpTransport.sendMail(mailOptions);
        return {message: 'mail sent'};

    }catch(error){
        console.log('this error?');
        console.log(error);
        return {message: ' error occurred while sending'};
    }
};

