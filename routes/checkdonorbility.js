
module.exports = async function checkeligibility(userdata){
    var dob = userdata.DOB;
    var lastdonation = userdata.lastdonation;
    dob = dob.split('-');                       //Make sure to relate with the frontend
    lastdonation = lastdonation.split('-');

}