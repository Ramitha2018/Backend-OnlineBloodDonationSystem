const jwt = require('jsonwebtoken');
const addauth = require('../utils/addAuth.js');

require('dotenv').config();
const secret = process.env.JWT_KEY; // FROM ENVIRONMENTAL VARIABLES

module.exports = async function auth(req,res){
    console.log(req.headers);
    try{
        const token = req.headers.authorization.split(" ")[1]; /** Add the token under "Authorization bearer" header to the request */
        console.log(token);
        console.log(secret);
        let verify = jwt.verify(token, secret);
        //console.log(verify);
        if (!(verify)) {
            return false;                   // Never gonna be fired.
        } else{
            return verify;
        }
    }catch(error){
        console.dir(error);
        if(error.name === 'TokenExpiredError'){
            return {error:'token timeout'};
        }else{
            return null;
        }


    }

};



/**The proper way to handle the abovr scenario is with generating a promise
    to handle the authorization and passing the promise to a resolve,reject
    refer:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
 This method stops the main thread execution until completion of the authentication. Which may stop new events frm being handled
 */
