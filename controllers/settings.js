
//*
//* Setup file for the base application (5.0.0)
//* Creates .env file, which should then be edited at install
//* Also creates the appropriate navbar for the version
//*
'use strict';
var fs = require('fs');

var i = 0
var array = fs.readFileSync('./.env').toString().split("\n");
for(i in array) {
    console.log(array[i]);
}


////////////////////////////////////////////
// display the home page for the settings //
////////////////////////////////////////////
exports.settingsHome = function(req, res) {
    sess=req.session;
    sess.success=null;
    sess.error=null;
    var name = req.query.name;

    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
 

 /**
  * Get the contents of the .env file and display on settings screen
  */
    var version = process.env.VERSION;
    var env = process.env.NODE_ENV;

    var dbHost = process.env.DB_HOST;

    var dbName = process.env.DB_NAME;
    var dbUser = process.env.DB_USER;
    var dbPass = process.env.DB_PASS;
   
    var ccSSL = process.env.CC_SSL;
    var infileDis = process.env.INFILE_DISABLED;
    var infileLocal = process.env.LOCAL_INFILE;
    var port = process.env.PORT;
    
    var exportSource = process.env.EXPORT_SOURCE;
    
    var sweep = process.env.SWEEP_SCHED;
    var sweepDir = process.env.SWEEP_FILE;
    var pictureDir = process.env.PICTURE_DIR;
    
    var muster = process.env.MUSTER;

    var certName = process.env.CERT_NAME;
    var certPass = process.env.CERT_PASSPHRASE;

    var emailHost = process.env.EMAIL_HOST;  
    var emailPort = process.env.EMAIL_PORT; 
    var emailSecure = process.env.EMAIL_SECURE;  
    var emailUser = process.env.EMAIL_USER; 
    var emailPass = process.env.EMAIL_PASS; 
    var emailFrom = process.env.EMAIL_FROMADDR; 
    


        
   
   
 /**
  * Ensure only authorised viewers can see the settings screen
  */
console.log('sess.userType = '+sess.userType);

 if (sess.userType == '2'){
    res.render('settings', { title: 'Command Center' + name, username: sess.username, version, env, dbHost, dbName, dbUser, dbPass, ccSSL, port, infileDis, infileLocal, exportSource, certName, certPass, sweep, sweepDir, pictureDir, muster, emailHost, emailPort, emailSecure, emailUser, emailPass, emailFrom });
    } else {
    res.render('Unauthorized', { title: 'Command Center'});
    }

}
};

////////////////////////////////////////////////////////////////////////////////////////
//* Make a change to the settings, update the .env file                               //
////////////////////////////////////////////////////////////////////////////////////////
exports.settingsUpdate = function(req, res) {
    sess=req.session;

    /**
     * Create an array from the display fields so we can write the .env file
     */
    
    var param_array = [{
        value: 'VERSION='+process.env.VERSION
        },
        {
        value: 'DB_HOST='+req.body.dbHost
        },
        {
        value: 'DB_NAME='+req.body.dbName
        },
        {
        value: 'DB_USER='+req.body.dbUser
        },
        {
        value: 'DB_PASS='+req.body.dbPass
        },
        {
        value: 'NODE_ENV='+process.env.NODE_ENV
        },
        {
        value: 'CC_SSL='+req.body.sslRadios
        },
        {
        value: 'PORT='+req.body.port
        },
        {
        value: 'INFILE_DISABLED='+req.body.infileRadioDisabled
        },
        {
        value: 'LOCAL_INFILE='+req.body.infileRadioLocal
        },
        {
        value: 'EXPORT_SOURCE='+req.body.exportRadios
        },
        {
        value: 'SWEEP_FILE='+req.body.sweepFile
        },
        {
        value: 'PICTURE_DIR='+req.body.picDir
        },
        {
        value: 'SWEEP_SCHED='+req.body.sweepRadios
        },
        {
        value: 'MUSTER='+req.body.musterRadios
        },
        {
        value: 'CERT_NAME='+req.body.certNameSet
        },
        {
        value: 'CERT_PASSPHRASE="'+req.body.certPassSet+'"'
        },
        {
        value: 'EMAIL_HOST='+req.body.emailHost
        },
        {
        value: 'EMAIL_PORT='+req.body.emailPort
        },
        {
        value: 'EMAIL_SECURE='+req.body.emailSecure
        },
        {
        value: 'EMAIL_USER='+req.body.emailUser
        },
        {
        value: 'EMAIL_PASS='+req.body.emailPass
        },
        {
        value: 'EMAIL_FROMADDR='+req.body.emailFrom
        }];


  /**
   * function deletes the current .env file and writes a new one
   * 
   */
  function processInput ( param_array ) { 
  //This deletes the .env file before doing the copy.
   fs.unlinkSync('.env');     
   fs.open('.env', 'a', 666, function( e, id ) {
    //in some cases appends to the end of the last line rather than on a new line,
    //so write a blank line first
    //fs.appendFileSync(id, "" + "\r\n", null, 'utf8')

    for (var i=0; i<param_array.length; i++){
        fs.appendFileSync(id, param_array[i].value + "\r\n", null, 'utf8')
    }
    fs.close(id, function(){});
    process.exit(1)
    });
    sess.success='Settings have been changed'
    

    //res.status(301).redirect('/dashboard');
    };


    processInput(param_array);
};


//////////////////////////////////////////////////////////////
// Restart the application after settings have been changed //
//////////////////////////////////////////////////////////////
exports.settingsRestart = function(req, res) {
  
 sess.success=null;
 process.exit(1)
};