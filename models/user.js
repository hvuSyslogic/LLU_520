var mysql      = require('mysql');
var emailController = require('../controllers/emailController');




//*
//*
//*This is just a test handler right now
//*
//*
module.exports.authenticateUser = function(user, password, callback){
    
    if ((user == process.env.CC_USER) && (password == process.env.CC_PASSWORD)) {
      callback(null, 'Authenication_success');
    } else {
      callback('Authentication_fail', null);
    }
};

