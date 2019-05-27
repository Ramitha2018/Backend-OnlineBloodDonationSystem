const express = require('express');
const router = express.Router();
const app = require('../app.js');
const checkauth = require('../utils/reqAuth.js');
const sendReqMail = require('../search/searchreqhandler.js');

router.post('/', async (req, res) => {
    try {
        let temp = await checkauth(req, res);

        console.log(temp);
        if(temp === null){
            return res.status(401).json({
                code: '401',
                message:"Invalid token"
            });
        }else if(temp.error === 'token timeout') {
            return res.status(401).json({
                code: '401',
                message: 'Token timeout. PLease login to proceed'
            });
        }else if(temp.error === 'invalid token'){
            return res.status(401).json({
                code: '401',
                message: 'Invalid token'
            });
        }else {
            req.body.userData = temp;
            console.log('1st base');
            //console.log(req);
            result = await questionnaire(req, res)
        }
    }catch(error){
        console.dir(error);
        return res.status(400).json({
            code:'400'
        });

    }
});

async function questionnaire(req,res){
    console.log('dafaq is happening?');
    const gender = req.body.gender;
    const bloodtype =  req.body.bloodtype;
    const district = req.body.district;
    const currenthealth = req.body.currenthealth;
    const pasthealth = req.body.pasthealth;
    const recentdonate = req.body.recentdonate;
    const availability = req.body.available;
    const firstlogindone = req.body.firstlogin || '0';
    let eligible;
    console.log('2nd base');

    // Setting the eligibility variable depending on the user's input
    if(currenthealth && pasthealth && recentdonate) {
        if (currenthealth == '1' & pasthealth == '0' & recentdonate == '0'){
            eligible = '1';
        }
        else {
            eligible = '0';
        }
    }

    let quiz ={
        gender : gender,
        blood_type : bloodtype,
        district : district,
        currenthealth : currenthealth,
        pasthealth : pasthealth,
        recentdonate : recentdonate,
        available : availability,
        firstlogindone : '1',
        eligible : eligible
    };
    console.log(quiz);

    const email = req.body.userData.email;
    console.log(email);
// Check for empty inputs
    if(firstlogindone === '1' & (gender === 'Male' | gender === 'Female') & district & bloodtype ){


    }
    else if(firstlogindone === '1' || firstlogindone === true){
        return res.status(400).json({
            code: '400',
            message:"missing required information"
        })
    }

    else{
        try{
            console.log('3rd base')
// Updating the questionnaire in the user database
            result = await app.db.collection('users').findOneAndUpdate({email:email},{$set:quiz},{projection:{pass : false},returnOriginal : false,})
            console.log('4th base');
            console.log(result);
// The mail sending to users' requests
            if (availability == '1' & eligible == '1') {
                console.log(res_searchReq = sendReqMail(req,res));               // The parallel process of matching search requests and sending notifications to users.

            }
// Response on Success!
            return res.status(200).json({
                code:'200',
                message:"Success. questionnaire added",
                updated_doc: result,
                link:"/home"
            })
        }catch(error){
            console.dir(error);
            return res.status(400).json({
                code:'400',
                message:"error occured in db connectivity"
            })
        }
    }
}

module.exports = router;