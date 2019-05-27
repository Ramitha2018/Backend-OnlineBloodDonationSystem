const express = require('express');
const app = require('../app.js');
const checkauth = require('../utils/reqAuth.js');
const searchreqhandler = require('../search/searchreqhandler');
router = express.Router();

router.post('/', async (req, res) => {
    try {
        let temp = await checkauth(req, res);                   // Token authentication

        console.log(temp);
        if(temp === null){
            return res.status(401).json({
                code: '401',
                message:"Invalid token"
            });
        }else if(temp.error === 'token timeout') {
            console.log('errror');
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

            result = await setUserInfo(req, res)
        }
    }catch(error){
        console.log('errror');
        console.log(error);
        return res.status(400).json({
            code: '400'
        })
    }
});

async function setUserInfo(req,res){
    const gender = req.body.gender;                     // Gender is not allowed to be changed at the moment
    const name = req.body.name;
    const permaddr = req.body.address;
    const district = req.body.district;
    const contact = req.body.contact;
    const currenthealth = req.body.currenthealth;
    const pasthealth = req.body.pasthealth;
    const recentdonate = req.body.recentdonate;
    const availability = req.body.available;
    let eligible;


// Setting the user eligibility for donations based on user
    if(currenthealth && pasthealth && recentdonate) {
        if (currenthealth == '1' & pasthealth == '0' & recentdonate == '0'){
            eligible = '1';
        }
        else {
            eligible = '0';
        }
    }

    let quiz ={
        name: name,
        permaddr : permaddr,
        district : district,
        contact_number: contact,
        currenthealth : currenthealth,
        pasthealth : pasthealth,
        recentdonate : recentdonate,
        available : availability,
        eligible : eligible
    };


    const email = req.body.userData.email;
    console.log(email);

// Check for empty fields of input
    console.log(quiz);
    if( !(name == undefined) & !(district == undefined)
        & !(permaddr == undefined) & !(availability == undefined & !(contact == undefined))){
        try{

            // Updating the database for new user data
            console.log(quiz);
            result = await app.db.collection('users').findOneAndUpdate({email:email},{$set:quiz},{projection:{_id : false, pass : false},returnOriginal : false,})
            if (availability === '1' && eligible === '1') {
                searchreqhandler(req,res);
            }

            return res.status(200).json({
                code: '200',
                message:"Success.",
                updated_doc: result,
            })
        }catch(error){
            console.log(error);
            console.log('db error')
            return res.status(400).json({
                code: '400',
                message:"error occured in db connectivity"
            })
        }

    }
    else{
        console.log('missing info');
        return res.status(400).json({
            code: '400',
            message:"missing required information"
        })
    }
}

module.exports = router;

