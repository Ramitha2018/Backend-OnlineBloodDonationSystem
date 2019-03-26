var express = require('express');
var router = express.Router();
var app = require('../app.js');
var checkauth = require('../utils/reqAuth.js');

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
            result = await questionnaire(req, res)
        }
    }catch(error){
        console.dir(error);
        return res.status(400);

    }
});

async function questionnaire(req,res){
    console.log('dafaq is happening?');
    var gender = req.body.gendr;
    var dob = req.body.dob;
    var permaddr = req.body.permadd;
    var bloodtype =  req.body.bloodtype;
    var district = req.body.district;
    var offiaddr = req.body.offiaddr;
    var hasdonatedb4 = req.body.donatedb4;
    var timesdonated = req.body.donatetimes;
    var lastdonate = req.body.lastdonate;
    var heartcondition = req.body.heart;
    var paralysis =  req.body.paralyze;
    var diabetes = req.body.diabetes;
    var kidneycondition = req.body.kidney;
    var bloodcondition = req.body.blood;
    var Lungcondition = req.body.lung;
    var fits = req.body.fit;
    var livercondition = req.body.liver;
    var cancer = req.body.cancer;
    var ispregnant = req.body.pregnant;
    var hiv = req.body.hiv;
    var donatefreq = req.body.frequency;
    var availability = req.body.available;
    var firstlogindone = req.body.firstlogin || '0';
    console.log('2nd base')
    console.log(req.body.dob);
    var quiz ={
        gender : gender,
        DOB : dob,
        permaddr : permaddr,
        blood_type : bloodtype,
        district : district,
        offiaddr : offiaddr,
        donatedB4 : hasdonatedb4,
        timesdonated :timesdonated,
        lastdonation : lastdonate,
        heart : heartcondition,
        paralysis : paralysis,
        diabetes : diabetes,
        kidney : kidneycondition,
        blood : bloodcondition,
        lung : Lungcondition,
        fit : fits,
        liver : livercondition,
        cancer :cancer,
        pregnancy : ispregnant,
        HIV : hiv,
        donation_frequency : donatefreq,
        Available : availability,
        firstlogindone : '1'
    };
    console.log(quiz);

    var email = req.body.userData.email;
    console.log(email)
    if(firstlogindone === '1' & (gender === 'M' | gender === 'F') & dob & district & donatefreq ){


    }
    else if(firstlogindone === '1'){
        return res.status(400).json({
            message:"missing required information"
        })
    }

    else{
        try{
            console.log('3rd base')

            result = await app.db.collection('users').findOneAndUpdate({email:email},{$set:quiz},{projection:{_id : false, pass : false},returnOriginal : false,})
            console.log('4th base')
            return res.status(200).json({
                message:"Success. questionnaire added",
                updated_doc: result,
                link:"/home"
            })
        }catch(error){
            console.dir(error);
            return res.status(400).json({
                message:"error occured in db connectivity"
            })
        }
    }
}

module.exports = router;