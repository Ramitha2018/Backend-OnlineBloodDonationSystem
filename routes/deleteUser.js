const express = require('express');
const app = require('../app.js');
const router = express.Router();
const checkauth = require('../utils/reqAuth.js');

router.post('/', async (req, res) => {
    try {
        let temp = await checkauth(req, res);       // Token authentication

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
        }else if(temp.type === 'admin'){                /** Admin creation must be done manually at the server side with all respective fields of records
                                                            such as isVerified = '1', firstlogindone = '1'*/
            req.body.userData = temp;

            result = await deleteUser(req, res)
        }
    }catch(error){
        console.dir(error);
        return res.status(400).json({
            code:'400'
        });

    }
});

async function deleteUser(req,res){
    let mail = req.body.targetMail;
    let extra = req.body.reason;
    console.log(mail);
    try{                    // Finding the user based on the email
        result = await app.db.collection('users').findOneAndDelete({email:mail});
        console.log(result);
        if(!(result.value)){
            return res.status(200).json({
                code:'400',
                message: 'User not found'
            })

        }else{
            return res.status(200).json({
                code: '200',
                message: extra || 'none given'
            });
        }

    }catch(error){
        console.log(error);
        return res.status(400).json({
            code:'400',
            message: 'Error while deleting the user'
        })
    }
}

module.exports = router;