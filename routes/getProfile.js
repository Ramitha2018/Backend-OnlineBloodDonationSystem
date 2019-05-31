const express = require('express');
const app = require('../app.js');
const checkauth = require('../utils/reqAuth.js');

router = express.Router();

router.post('/', async (req, res) => {
    try {
        let temp = await checkauth(req, res);   // Token authentication

        console.log(temp);
        if(temp.error === 'token timeout') {
            return res.status(401).json({
                code: '401',
                message: 'Token timeout. PLease login to proceed'
            });
        }else if(temp.error === 'invalid token'){
            return res.status(401).json({
                code: '401',
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
        return res.status(400).json({
            code:'400'
        })
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

    const email = req.body.userData.email.toLowerCase();
    try {
        result = await app.db.collection('users').findOne({email: email}, {projection:{firstlogindone: false, pass: false, verify_id: false}});
        return  res.status(200).json({
            code:'200',
            result: result,
            message: 'Success'
        })
    }catch(error){
        console.dir(error);
        return res.status(400).json({
            code:'400',
            message: 'DB connection error'
        });

    }
}

module.exports = router;