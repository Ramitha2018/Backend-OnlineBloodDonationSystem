var jwt = require('jsonwebtoken');
var addauth = require('../utils/addAuth.js');

require('dotenv').config();
var secret = process.env.JWT_KEY; // FROM ENVIRONMENTAL VARIABLES

module.exports = async function auth(req,res){
    try{
        const token = req.headers.Authorization.split(" ")[1]; /** Add the token under "Authorization bearer" header to the request */
        console.log(token);
        console.log(secret);
        const decoded = jwt.verify(token, secret);
        return decoded;
        //req.userData = decoded;
    }catch(error){
        console.dir(error);
        if(error.name = 'TokenExpiredError'){
            const token = req.headers.Authorization.split(" ")[1];
            const userdetail = jwt.decode(token, secret);
            var email = userdetail.email;
            return addauth.removeAuth(email);
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
