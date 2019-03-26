var express = require('express');
var router = express.Router();
//var authutil = require('../utils/authutil.js');
var bcrypt = require('bcryptjs');
//var mongodb = require('mongodb');
var app = require("../app.js");


router.post('/',async function (req,res) {
    memail = req.body.email;
    mpass = req.body.pass;
    contactnumber = req.body.contact;
    fname = req.body.fname;
    lname = req.body.lname;
    nic = req.body.NIC;
    var salthash;

    //check for missing input fields
    if(memail.length === 0 || mpass.length === 0 || contactnumber.length === 0 || fname.length === 0 || lname.length === 0 || nic.length === 0){
        return res.status(400).json({
            message: "missing required information"
        })
    }

    if(mpass.length < 8 ){                  //password length check
        return res.status(400).json({
            message:"Invalid lengthed password"
        })
    }

    if(memail.indexOf('@') === -1){          //email format check
       return res.status(400).json({error:"Please Enter a valid email address"});
    }
    console.log("create user account", memail,mpass);
    try {
        var salthash = await new Promise((resolve,reject) =>{ //salted hash of the user password
            bcrypt.hash(mpass, 10, function(err, hash){
                if(err) reject(err);
                resolve(hash);
            });
        });
    }catch (error) {                            //callback error handling of hashing
        console.log("ftyhrtfyftyfty");
        res.status(500).json({
            error: error
        });
        throw(error)
    }

    console.log("rtyghrtfhrtfhrfthrtf");
    try {
        //console.log(app);
        //console.log(app.db);
        console.log('exist?')
        var isExisting = await app.db.collection('users').findOne({"email": memail});   //check for duplicate email addresses in the database
        console.log(isExisting);
        console.log('exist returned?');
        if (isExisting) {                                                       //result if email already existing
            console.log('existing');
            return res.status(401).json({
                err: "Existing Email. Retry"
            })
        }
    }catch(error){
        return res.status(400).json({result: "db not existing", error: error})  //callback error handling of the database fetch
    }
    console.log("rkakakakaka");
    user = {email:memail, pass:salthash, contact_number:contactnumber, name:fname+' '+lname, NIC:nic, firstlogindone: false};         //object passed as a document

    try{
        dbres = await app.db.collection("users").insertOne(user);               //updating the database
        console.log("inserted?");
        console.log("user created",memail,mpass);
        //console.log(res);
        return res.status(200).json({
            code:"200",
            message:"Successfully created user"
        });
    }catch{
        res.status(409).json({result:409});
        return
    }
});

module.exports = router;