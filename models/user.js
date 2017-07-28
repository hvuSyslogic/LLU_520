var mysql      = require('mysql');
var emailController = require('../controllers/emailController');
var crypto = require('crypto')
var db = require('./db');


///////////////////////////////////////////////
// Common functions for the cryto processing //
///////////////////////////////////////////////
	
	/**
	 * generates randon tring of charcters i.e 'salt'
	 */

	var genRandomString = function(length){
	    return crypto.randomBytes(Math.ceil(length/2))
	            .toString('hex') /** convert to hexadecimal format */
	            .slice(0,length);   /** return required number of characters */
	};

	/**
	 * hash password with sha512.
	 * @function
	 * @param {string} password - List of required fields.
	 * @param {string} salt - Data to be validated.
	 */
	var sha512 = function(password, salt){
	    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
	    hash.update(password);
	    var value = hash.digest('hex');
	    return {
	        salt:salt,
	        passwordHash:value
	    };
	};

//////////////////////////////////////////////////////////////////////////////////////////////////
// handles the encryption hash+salt of passwords do that there are no naked passwords in the db //
//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.saltHashPassword = function (userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
	return {
		hash : passwordData.passwordHash,
		salt : salt
	}


};


////////////////////////////////////////////////////////////
// Authenticate command center user and password entry // //
////////////////////////////////////////////////////////////

module.exports.authenticateUser = function(user, password, callback){

	/**
	 * Check the user table for the name and retrieve salt
	 */
	db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          var strSQL = 'select * from users where UserName="'+user+'"';
              console.log('USER ADD strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {
                
                 if (err || result.length ==0 ) {
                    console.log(err)
                    connection.end();
                    callback('Authentication_fail_creds', null);
                  } else {

                    connection.end();
                    /**
                     * Use the salt and the entered password to compare with the stored password hash
                     */
                    

                    var salt = result[0].RGen /** Gives us stored salt */
				    var passwordData = sha512(password, salt);
				    console.log('UserPassword = '+password);
				    console.log('Passwordhash = '+passwordData.passwordHash);
				    console.log('nSalt = '+passwordData.salt);
					if (result[0].Password == passwordData.passwordHash) {
						
						/**
	                     * Check user is 'Active'
	                     */
	                    if (result[0].Status == '1'){

							sess.userType = result[0].PrivLevel
							console.log('sess.userType = '+sess.userType);
							callback(null, 'Authentication_success');
						}else{
							callback('Authentication_fail_status', null);
						}
					}else{
						callback('Authentication_fail_creds', null);
					}
					
                    
                   
                  }
              });//end of connection.query

}
});
}

