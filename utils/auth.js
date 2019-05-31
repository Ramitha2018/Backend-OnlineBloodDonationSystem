const express =  require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const app = require('../app.js');
const bcrypt = require('bcryptjs');
//var addAuth = require('../utils/addAuth.js');
require('dotenv').config();

router.post('/',async function(req,res) {

    let today = new Date();
    lastLoginTime = today.getTime();
    console.log(lastLoginTime);

    console.log(req.get('protocol'));
    const memail = req.body.email.toLowerCase();
    const mpass = req.body.pass;
    let mtype;

    let userpass;
    let user;

    let userData;
    const secretkey = process.env.JWT_KEY;

    console.log('auth', memail, mpass);

    if (memail.indexOf('@') === -1) { //Checking for valid email address format
        return res.status(400).json({
            code: '400',
            error: "Please Enter a valid email address"});
    }
    try {
        user = await app.db.collection('users').findOne({email: memail}); //Getting the user's information collection from the database if exists
        console.log(user);
        console.log("-----------")
        if (user) {
            if(user.isVerified == 0 || user.isVerified === false){           // Check for Email verification
                return res.status(200).json({
                    code:'303',
                    message: 'Email not verified'
                })
            }
            userpass = user.pass;               //If user's email exists, the password is prepared for comparison
            console.log(userpass);

        }
        else {
            console.log("this one?")                //response in case of user email not existing in DB
            return res.status(200).json({
                code: '401',
                error: "Authentication Failed"});
        }


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            code: '400',
            error: "DB Connection Error"}) //handling error of db connectivity problems
    }
    try {
        let compare = await bcrypt.compare(mpass, userpass); //comparing users given password with the hashed stored password in the DB
        console.log(compare);
        if (!(compare)) {
            console.log("that one?");
            return res.status(200).json({           //result of password mismatch
                code: '401',
                error: "Authentication Failed"
            });
        }
        else {
            console.log('******************')
            console.log(user.userType);
            const token = jwt.sign(                 //in the case of valid authentication, generating a JWT token for user
                {
                email: req.body.email,
                type: user.userType,
                userId: userpass._id,
                }, secretkey, {
                expiresIn: "1h"
                }
            );
            try{
                ret = await app.db.collection('users').findOneAndUpdate({email:memail},{$set:{'lastLoginTime': lastLoginTime}}, {projection:{firstlogindone: false, pass: false, verify_id: false}, returnOriginal: false});      //The last login time is updated for future references
                userData = ret;
                console.log(ret);
            }catch(err){
                console.dir(err)
                return res.status(400).json({
                    code:'400',
                    message: 'sudden error'
                })
            }


            console.log(user);
            console.log(user.firstlogindone);
            if(user.firstlogindone == '1' || user.firstlogindone === true){

                return res.status(200).json({           //passing the success and the token to the user.
                    code: '200',
                    message: "Authentication Successful",
                    token: token,
                    userType:user.userType,
                    userData: userData.value
                });
            }
            else if(user.firstlogindone == '0' || user.firstlogindone === false){                                       //if the first login of the user redirecting to the  questionnaire page
                return res.status(201).json({
                    code:'201',
                    token: token,
                    message: "redirect to the link. Add firstlogindone to the body",
                    userType:user.userType,
                    link: "/quiz",
                    userData: userData.value
                })
            }

        }
    } catch (error) {                               //error handling for the promise of bcrypt.compare
        console.dir(error);
        console.log("or is it this one?");
        return res.status(401).json({
            code: '401',
            message: "Authentication Failure"
        })
    }
});

module.exports = router;
