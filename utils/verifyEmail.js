const express = require('express');
const nodemailer = require("nodemailer");
const app = require('../app.js');
const router = express.Router();
require('dotenv').config();


/*------------------Routing Started ------------------------*/

/**router.post('/',function(req,res){
    res.sendfile('index.html');
});*/
console.log('here');

// LOOK OUT FOR MULTI-THREADING ISSUES HERE
router.post('/',async function(req,res){
    console.log(req.get('host'));
    console.log('IS IT THIS ONE?');
    console.log(req.protocol+":/"+req.get('host'));
    //if(("http://"+req.get('host'))==("http://"+host)){

        //console.log("Domain is matched. Information is from Authentic email");
        console.log(req.query.mail);
        try{
            var rand = await app.db.collection('users').findOne({email:req.query.mail})
        }catch(error){
            return res.status(400).json({
                code: '400',
                message:'db connection error'
            })
        }
        console.log(rand);
        if(!(rand)){
            return res.status(400).json({
                code:'400',
                message:'invalid email'
            })
        }
        if(req.query.id == rand.verify_id)
        {
            try {
                result = await app.db.collection('users').findOneAndUpdate({email: req.query.mail}, {$set: {isVerified: '1'}})
                console.log(result);
            }catch(error){
                console.log(error);
                return res.status(400).json({
                    code: '400',
                    messsage:'db error'
                })
            }
            console.log("email is verified");
            return res.status(200).json({code:'200', message : "Email has been Successfully verified"});
        }
        else
        {
            console.log("email is not verified");
            return res.status(401).json({ code:'401', message: "Email is not verified"})
        }
    //}
    //else
    //{
       // return res.status(400).json({message: "Request is from unknown source"});
    //}
});

module.exports = router;
