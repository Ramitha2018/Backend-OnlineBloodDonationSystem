const express = require('express');
const router = express.Router();
const app = require('../app.js');
const sendReqMail = require('./sendReqNotification.js');

module.exports = async function checkReq(req,res) {
    const newusermail = req.body.email;
    const newuserbloodtype = req.body.bloodtype;
    const newuserdistrict = req.body.district;
    let requesteremail;
    try {
        requests = await app.db.collection('SeekerRequest').find({blood_type: newuserbloodtype, ditrict: newuserdistrict},{field: {email : 1}});
        if(requests.length === 0){
            return false
        }else{
            for (let email in requests){
                requesteremail = email;
                req.body.reqmail = requesteremail;
                return result = await sendReqMail(req);

            }
        }

    }catch(error){
        console.dir(erre);
        return {message:'DB access error'}
    }
}