const nodemailer = require('nodemailer');
require('dotenv').config();


/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and receiving email.
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

module.exports = async function sendReminder(user){
    let mailOption = {
        from: process.env.SMTP_USER,
        to: user,
        subject: 'Reminder on updating your online blood donor profile',
        http: 'Dear Sir/Madam,<br>Please log in to your donor profile at Online Blood Donation System & update your current status.'
    }

    console.log(mailOption);

    temp = await smtpTransport.sendMail(mailOptions);
    return 'reminder sent to '+user


};

