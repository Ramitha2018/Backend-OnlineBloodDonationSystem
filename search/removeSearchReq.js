const express = require('express');
const app = require('../app.js');
const checkauth = require('../utils/reqAuth.js');
const searchreqhandler = require('../search/searchreqhandler');
router = express.Router();

router.post('/', async (req, res) => {
    try {
        let temp = await checkauth(req, res);                   // Token authentication
        console.log('authed');
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
            req.body.userData = temp;                   // Attaching the token bearers email to the request

            result = await removeReq(req, res)
        }
    }catch(error){
        console.log(error);
        return res.status(400).json({
            code: '400'
        })
    }
});

async function removeReq(req, res) {

    const email = req.body.userData.email.toLowerCase();
    try {
        console.log(email);
        console.log('at db')
        temp = await app.db.collection('SeekerRequests').deleteMany({req_email: email}).then(tmp => {
            console.log(tmp);
            if (tmp.result.ok == 1 && tmp.result.n > 0) {
                console.log('deleted');
                return res.status(200).json({
                    code: '200',
                    message: 'Requests Cleared'
                })

            } else if (tmp.result.ok == 1 && tmp.result.n == 0){
                console.log('not found');
                return res.status(200).json({
                    code: '400',
                    message:'No Requests found'
                })
            }

        })
    }catch(error){
        console.dir(error);
        return res.status(400).json({
            code: '400',
            message:'Error Occurred'
        })
    }
}
module.exports = router;