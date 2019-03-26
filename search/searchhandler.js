var express = require('express');
var router = express.Router();
var app = require('../app.js');



router.post('/', async function (req , res){
    var results;
    var bloodtype = req.body.bldtype;
    var userloc = req.body.district;
    var userarea = req.body.region;

    var searchreq = {
        bloodtype: bloodtype,
        district: userloc
    }

    try {
        results = await app.db.collection('users').find({               //finding matching results according to both blood type and location
            bloodtype: bloodtype,
            district: userloc
        })
    }catch(error){
        return res.status(400).json({                                   //database connectivity error handling
            message:'error encountered'
        })
    }
    try{
        if(!(results.length)){                                          //check for empty results
            results = await app.db.collection('users').find({bloodtype: bloodtype});            //if result is empty do the search again only for blood type

            if(!(results.length)){                                      //check for the empty result for the second query
                try {
                    resp = await app.db.collection('SeekerRequest').insertOne(searchreq);       //adding the search request as a future query to the db

                    return res.status(400).json({                       //response if no matching results exist
                        message: "No matching results"
                    })
                }catch(error){                                          //error handling of the search request insert
                    return res.status(400).json({
                        message:'error encountered'
                    })
                }
            }
            else{                                                       //successful search result for the BLOOD TYPE ONLY search
                return res.status(200).json({
                    result: results
                })
            }
        }else{
            return res.status(200).json({                               //successful search result for BLOOD TYPE + DISTRICT
                result: results
            })
        }
    }catch{
        return res.status(400).json({
            message: 'Error Occurred'
        })
    }



});
module.exports = router;