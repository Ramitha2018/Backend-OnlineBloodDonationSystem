const express = require('express');
const router = express.Router();
const app = require('../app.js');



router.post('/', async function (req , res){
    let results;
    let result;
    const bloodtype = req.body.bldtype;
    const userloc = req.body.district;
    const userarea = req.body.region;
    const setRequest = req.body.needRequest;
    console.log(setRequest);
    let searchreq;
    if (req.body.email) {
         searchreq = {
            req_email: req.body.email.toLowerCase(),
            bloodtype: bloodtype,
            district: userloc
        }
    } else {
         searchreq = {
            bloodtype: bloodtype,
            district: userloc
        }
    }


    try {
        console.log(app);
        temp = await app.db.collection('users').find({               //finding matching results according to both blood type and location
            blood_type: bloodtype,
            district: userloc,
            available: { $in : ["1", true]}
        }, {projection: {
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
    try{
        console.log("results");
        console.log(results);
        if(results.length === 0){                                          //check for empty results
            console.log('got here');
            await app.db.collection('users').find({ blood_type: bloodtype, available: { $in : ["1", true] }},
                {projection: {
                    email: true,
                    name: true,
                    district: true,
                    address: true,
                    contact_number: true,
                    }
                }).toArray().then(tmp => {
                    result = tmp;
            });

//if result is empty do the search again only for blood type
            console.log('result');
            console.log(result);
            if(result.length === 0){                                      //check for the empty result for the second query
                console.log('and then here');
                try {
                    if (setRequest){
                        console.log('here too');
                        if (req.body.email){
                            console.log('email not empty');
                            checkForDuplicates = await app.db.collection('SeekerRequests').findOne({
                                req_email: req.body.email,
                                bloodtype: bloodtype,
                                district: userloc
                            });
                            console.log(checkForDuplicates);
                            if(!(checkForDuplicates)){
                                resp = await app.db.collection('SeekerRequests').insertOne(searchreq);       //adding the search request as a future query to the db
                                //console.log(resp);
                                return res.status(200).json({
                                    code:'200',
                                    message:'No matching result. Request added'
                                })
                            }
                            return res.status(200).json({
                                code:'400',
                                message:'No matching result. Duplicate Request found'
                            })


                        }else {
                            console.log('email empty');
                            return res.status(400).json({
                                code:'400',
                                message: 'Requester Email missing. Retry'
                            })
                        }

                    }
                }catch(error){                                          //error handling of the search request insert
                    console.log(error);
                    return res.status(400).json({
                        message:'error encountered'
                    })
                }
                console.log('I know it is');
                return res.status(200).json({                       //response if no matching results exist
                    code: "400",
                    message: "No matching results"
                })
            }
            else{                                                       //successful search result for the BLOOD TYPE ONLY search
                console.log('blood type only search success')
                console.log(result);
                return res.status(200).json({
                    result: result
                })
            }
        }else{
            console.log('blood type + district only search success')
            console.log(results);
            return res.status(200).json({                               //successful search result for BLOOD TYPE + DISTRICT
                result: results
            })
        }
    }catch(error){
        console.dir(error);
        return res.status(400).json({
            message: 'Error Occurred'
        })
    }



});
module.exports = router;