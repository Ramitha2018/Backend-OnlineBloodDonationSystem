const app = require('../app.js');
const sendReminder = require('./sendReminder.js');
require('dotenv').config();


module.exports = async function remindUser(){
    const remindingCrit = process.env.INACTIVE_MONTHS;
    let date = new Date();
    currentTime = date.getTime();
    comparisonTime = currentTime - (remindingCrit * 30 * 24 * 3600000);     //number of months * size of a month in days * size of a in hours * day in milliseconds
    let user;
    let loginDueUsers;
    try{
        let temp = await app.db.collection('users').find({lastLoginTime:{ $lt: comparisonTime }},{projection:{_id: false, email: true}}).toArray().then(tmp =>{
            loginDueUsers = tmp;
            return new Promise((resolve, reject) => {
                resolve(loginDueUsers);
            })
        }).then( check => {
            console.log(check);
        })
    }catch(error){
        console.dir(error);
        console.log('Unable to connect to DB to carry out reminding task for users')
    }

    loginDueUsers.forEach(async function (elem){
        console.log(elem);
        try{
            temp = await sendReminder(elem);
            console.log(temp);
        }catch(error){
            console.dir(error);
            console.log('Error occurred while sending reminding emails')
        }
    });

}