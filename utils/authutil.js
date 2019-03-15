
/**
var genRandomString = function(length) {
    return require('crypto').randomBytes(Math.ceil(length /2))
        .toString('hex')
        .slice(0, length);
};

var md5hash = function(password, salt){
    console.log(password,salt);
    var value = require('crypto').createHash('md5', salt).update(password).digest('hex'); /** Hashing algorithm md5
    //hash.update(password);
    //var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};


function saltHashPassword(userpassword) {

   // var passwordData = "sss";

    var salt = genRandomString(16); /** Generates a random number of length 16
    var passwordData = md5hash(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
    return passwordData;
}
*/

//module.exports = router;