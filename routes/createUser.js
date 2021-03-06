const express = require('express');
const router = express.Router();
//var authutil = require('../utils/authutil.js');
const bcrypt = require('bcryptjs');
//var mongodb = require('mongodb');
const app = require("../app.js");
const sendmail = require('../utils/sendVerifyEmail.js');


//console.log("verifymail",verifymail);

router.post('/',async function (req,res,next) {
    const memail = req.body.email.toLowerCase();
    const mpass = req.body.pass;
    const contactnumber = req.body.contact;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const nic = req.body.NIC;
    const address = req.body.address;
    const DOB = req.body.dob;
    const acctype = req.body.type; //PUT THIS SOMEWHERE USEFUL
    var salthash;

    //check for missing input fields
    if(memail.length === 0 || mpass.length === 0 || contactnumber.length === 0 || fname.length === 0 || lname.length === 0 || nic.length === 0){
        return res.status(400).json({
            code: '400',
            message: "missing required information"
        })
    }

    if(mpass.length < 8 ){                  //password length check
        return res.status(400).json({
            code: '400',
            message:"Invalid lengthed password"
        })
    }

    if(memail.indexOf('@') === -1){          //email format check
       return res.status(400).json({
           code: '400',
           error:"Please Enter a valid email address"});
    }
    console.log("create user account", memail,mpass);
    try {
        salthash = await new Promise((resolve,reject) =>{ //salted hash of the user password
            bcrypt.hash(mpass, 10, function(err, hash){
                if(err) reject(err);
                resolve(hash);
            });
        });
    }catch (error) {                            //callback error handling of hashing
        console.log("ftyhrtfyftyfty");
        res.status(500).json({
            code: '500',
            error: error
        });
        throw(error)
    }

    console.log("rtyghrtfhrtfhrfthrtf");
    try {
        //console.log(app);
        //console.log(app.db);
        console.log('exist?')
        var isExisting = await app.db.collection('users').findOne({$or: [{"email": memail},{"NIC": nic}]});   //check for duplicate email addresses in the database
        console.log(isExisting);
        console.log('exist returned?');
        if (isExisting) {                                                       //result if email already existing
            console.log('existing');
            return res.status(401).json({
                code: "401",
                err: "Existing Email or NIC. Retry"
            })
        }
    }catch(error){
        return res.status(400).json({
            code: '400',
            result: "db not existing", error: error})  //callback error handling of the database fetch
    }
    console.log("rkakakakaka");
    /*user = {
        email:memail,
        pass:salthash,
        contact_number:contactnumber,
        name:fname+' '+lname,
        NIC:nic,
        isVerified: '0',
        firstlogindone: '0'
    };         //object passed as a document*/

    try{

        var temp = await sendmail(req,res); //NOT STOPPING HERE
        console.log(temp);

        dbres = await app.db.collection("users").insertOne({

            email:memail,
            pass:salthash,
            userType:'user',
            DOB: DOB,
            contact_number:contactnumber,
            address: address,
            name:fname+' '+lname,
            NIC:nic,
            isVerified: '0',
            firstlogindone: '0',
            verify_id: temp});               //updating the database

        console.log("inserted?");
        console.log("user created",memail,mpass);
        console.log(dbres);

        if(temp) {
            return res.status(200).json({
                code: "200",
                message: "Successfully created user"
            });
        }else{
            return res.status(400).json({
                code: "400",
                message: "error in db access"
            })

        }

    }catch(error){
        console.log(error);

        return res.status(409).json({code:409, error:error.name});
    }
});

//next(req,res);
module.exports = router;