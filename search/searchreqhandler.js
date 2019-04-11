const express = require('express');
const router = express.Router();
const app = require('../app.js');

module.exports = async function checkReq(req,res) {
    const newuserbloodtype = req.body.bloodtype;
    const newuserdistrict = req.body.district;
    var requesteremail;
    try {
        requests = await app.db.collection('SeekerRequest').find({blood_type: newuserbloodtype, ditrict: newuserdistrict},{field: {email : 1}});
        if(requests.length === 0){
            return false
        }else{
            for (email in requests){
                requesteremail = email;
                temp = await app.db.collection().findOneAndUpdate(//find a way to update a lot of notificatiojns to a user)
            }
        }

    }catch(error){

    }
}