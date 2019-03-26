const express = require('express');
const app = require('../app.js');
const checkauth = require('../utils/reqAuth.js');

router = express.Router();

router.post('/', async (req, res) => {
    try {
        var temp = await checkauth(req, res);

        console.log(temp);
        if(temp.error === 'token timeout') {
            return res.status(401).json({
                message: 'Token timeout. PLease login to proceed'
            });
        }else if(temp.error === 'invalid token'){
            return res.status(401).json({
                message: 'Invalid token'
            });
        }else if(temp === null){
            return res.status(401).json({
                message:"Authentication Failure"
            });
        }else {
            req.body.userData = temp;
            console.log('1st base');
            //console.log(req);
            result = await getUserInfo(req, res)
        }
    }catch(error){
        console.dir(error);
        return res.status(400);
    }
});

async function getUserInfo(req,res) {
    /**var gender;
    var dob;
    var permaddr;
    var bloodtype;
    var district;
    var offiaddr;
    var hasdonatedb4;
    var timesdonated;
    var lastdonate;
    var heartcondition;
    var paralysis;
    var diabetes;
    var kidneycondition;
    var bloodcondition;
    var Lungcondition;
    var fits;
    var livercondition;
    var cancer;
    var ispregnant;
    var hiv;
    var donatefreq;
    var availability; */

    var email = req.body.email;
    try {
        result = await app.db.collection('users').findOne({email: email}, {firstlogindone: false});
        return  res.status(200).json({
            result: result,
            message: 'Success'
        })
    }catch(error){
        console.dir(error);
        return res.status(400).json({
            message: 'DB connection error'
        });

    }
}

module.exports = router;