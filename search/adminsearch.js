const express = require('express');
const router = express.Router();
const app = require('../app.js');

router.post('/', async function(req , res) {
    let results;
    const email = req.body.email.toLowerCase();
    const name = req.body.name;

    let searchreq;
    if (!email && !name) {
        return res.status(200).json({
            message: 'Empty criteria',
            code: '400'
        });
    }
    else if (!email) {
        searchreq = { name: { $in: [name]}}
    } else if (!name) {
        searchreq = { email: email }
    } else if (email && name){
        searchreq = { name: { $in: [name], email: email}}
    }

    try {
        temp = await app.db.collection('users').find(               //finding matching results according to both blood type and location
            searchreq,
         {projection: {
                email: true,
                name: true,
                district: true,
                address: true,
                contact_number: true,
            }
        }).toArray().then(tmp => {
            results = tmp;
        })
    }catch(error){
        console.dir(error);
        return res.status(400).json({                                   //database connectivity error handling
            message:'error encountered'
        })
    }

        if(results.length !== 0) {
            return res.status(200).json({
                result: results
            })
        } else if (results.length === 0) {
            return res.return(200).json({
                messaget:"No matching results",
                code: '400'
            })
        }





});

module.exports = router;