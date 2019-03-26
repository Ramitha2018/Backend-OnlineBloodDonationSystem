var express =  require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var app = require('../app.js');
var bcrypt = require('bcryptjs');
var addAuth = require('../utils/addAuth.js');
require('dotenv').config();

router.post('/',async function(req,res) {
    var memail = req.body.email;
    var mpass = req.body.pass;
    //var salthash;
    var userpass;
    var secretkey = process.env.JWT_KEY; //MUST BE MOVED TO A SEPARATE FILE CONTAINING ENVIRONMENT VARIABLES
    console.log('auth', memail, mpass);

    if (memail.indexOf('@') === -1) { //Checking for valid email address format
        return res.status(400).json({error: "Please Enter a valid email address"});
    }
    try {
        userpass = await app.db.collection('users').findOne({email: memail}); //Getting the user's information collection from the database if exists
        console.log(userpass);
        console.log("-----------")
        if (userpass) {                             //If user's email exists, the password is prepared for comparison
            userpass = userpass.pass;
            console.log(userpass);

        }
        else {
            console.log("this one?")                //response in case of user email not existing in DB
            return res.status(404).json({error: "Authentication Failed"});
        }


    } catch (error) {
        return req.status(400).json({error: "DB Connection Error"}) //handling error of db connectivity problems
    }
    try {
        var compare = await bcrypt.compare(mpass, userpass); //comparing users given password with the hashed stord password in the DB
        console.log(compare);
        if (!(compare)) {
            console.log("that one?");
            return res.status(401).json({           //result of password mismatch
                error: "Authentication Failed"
            });
        }
        else {
            const token = jwt.sign(                 //in the case of valid authentication, generating a JWT token for user
                {
                email: req.body.email,
                userId: userpass._id
                }, secretkey, {
                expiresIn: "1h"
                }
            );
            addAuth.addAuth(req.body.email,token);
            if(userpass.firstlogindone){
                return res.status(200).json({           //passing the success and the token to the user.
                    message: "Authentication Successful",
                    token: token
                });
            }
            else{                                       //if the first login of the user redirecting to the  questionnaire page
                return res.status(303).json({
                    token: token,
                    message: "redirect to the link. Add firstlogindone to the body",
                    link: "/quiz",
                    firstlogindone: '0'
                })
            }

        }
    } catch (error) {                               //error handling for the promise of bcrypt.compare
        console.dir(error);
        console.log("or is it this one?");
        return res.status(401).json({
            message: "Authentication Failure"
        })
    }
});

module.exports = router;
