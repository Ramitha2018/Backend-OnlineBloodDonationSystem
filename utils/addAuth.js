

//var util = require(require('path').dirname(require.main.filename))+'/utils/util';// to gain the functionality of authutil.js

var keydict = {};//The array which holds the generated keys per each who have user login


function checkAuth(email,token) { // function to check for token availability

    console.log("checkAuth",email,token);

    if(email == null)return false;
    if(keydict[email] == token)return true;
    return false;
}


function addAuth(email,token){ //adding generated tokens to a collection for references. MUST BE CLEARED AFTER TIME OUT
    keydict[email] = token;
    console.log(keydict);
}

function removeAuth(email){ //function used to remove timed out tokens from the dictionary in local storage of server
    console.log(keydict);
    if(Object.keys(keydict).includes(email)){
        Object.keys(keydict).splice(Object.keys(keydict).indexOf(email),1);
        return {error:'token timeout'};
    }
    else{
        return {error: 'invalid email'};
    }
}


module.exports = {
    checkAuth:checkAuth,
    addAuth:addAuth,
    removeAuth:removeAuth
};