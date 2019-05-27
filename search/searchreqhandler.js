const express = require('express');
const router = express.Router();
const app = require('../app.js');
const sendReqMail = require('./sendReqNotification.js');

module.exports = async function checkReq(req,res) {

    const newuserbloodtype = req.body.bloodtype;
    const newuserdistrict = req.body.district;
    console.log(newuserbloodtype);
    console.log(newuserdistrict);

    let requests;
    let requesteremail;
    let email;
    let result = [];

    try {
        temp = await app.db.collection('SeekerRequests').find({bloodtype: newuserbloodtype, district: newuserdistrict},{projection:{req_email: true,_id: false}}).toArray().then(tmp => {
            //console.log('1',tmp);
            requests = tmp;
            return new Promise(resolve => {
                resolve(requests)
            })
        }).then(s => {
            //console.log('2', s);

        });

        console.log(requests,'requests');
        if(!(requests)){
            console.log('failed');
            return false
        }else{
            requests.forEach(async function (elem){
                console.log(elem);
                requesteremail = elem.req_email;
                req.body.reqmail = requesteremail;
                result.push(await sendReqMail(req));
                });
            console.log(result);



        }
        return result

    }catch(error){
        console.dir(error);
        return {message:'DB access error'}
    }
}