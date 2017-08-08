//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var writeReport = require('./writeReport');



///////////////////////////////////
//*  Display devices list screen //
///////////////////////////////////
module.exports.devicesHome = function(req, res) {
	sess=req.session;
  // initializes the success/error messages for the report generation
  // ..so that messages are removed after leaving and re-entering the attendance ascreen
  sess.rptSuccess=null;
  sess.rptError=null;

     // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

        //feb--connect to the database, performa query to get all rows from people and send that data to 
        //--to be rendered as a table in Jade
        //feb- we have user entry at this point and so setting up the credentials here
       //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;

              var _sqlQ = "SELECT * FROM DeviceHeader";
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('Device query error : '+err); connection.end(); callback(true); return; }
             
              connection.end()

              res.render('devices', { title: 'Command Center', username: req.session.username, results });
              });
            }
        });
    }
};




///////////////////////////////////////////
//* Retrieve a device record for editing //
///////////////////////////////////////////

module.exports.deviceGetOne = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          console.log('Authcode param '+req.params.authCode);
          var strSQL = 'SELECT * FROM DeviceHeader WHERE AuthCode="'+req.params.authCode+'"';
         
          var query = connection.query(strSQL, function(err, result) {

               if (err) {
                  console.log(err)
                  connection.end();
                  //sess.error = 'There was a problem updating the mobss database: '+err;
                  res.render('devices', { title: 'Command Center'});
                } else {
                  
                    connection.end();
                    res.render('deviceModify', { title: 'Command Center', result});
                    
                };
                });//feb--end of connection.query
        }
    });
};
}; //end of getOne handler


////////////////////////////////////////////////////////////////////////////////////////
//* Make a change to the device record.  As of 7/9/17, only the status can be updated //
////////////////////////////////////////////////////////////////////////////////////////
exports.deviceUpdateOne = function(req, res) {
  sess=req.session;
    var name = req.query.name;

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

        
              /**
               * Update the Device reord with the new CurrentStatus
               * 
               */
             
              var _currentStatus = '';
              if (req.body.currentStatus == 'WHITELIST'){
                _currentStatus = '1';
                }else if (req.body.currentStatus == 'GRAYLIST'){
                    _currentStatus = '2';
                    }else if (req.body.currentStatus == 'BLACKLIST'){
                        _currentStatus = '3';
                        }
                        else if (req.body.currentStatus == 'REQUESTING ACTIVATION'){
                          _currentStatus = '0';
                        } 
              console.log('authCode = '+ JSON.stringify(req.params.authCode));  

              var strSQL = 'UPDATE DeviceHeader SET CurrentStatus='+_currentStatus+' WHERE AuthCode="'+req.params.authCode+'"';
              console.log('update strSQL= '+ strSQL);  

              var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.redirect('devices', { title: 'Command Center'});
                  } else {
                    /**
                     * Successful update so let's create a device history record
                     */
                    var _authCode = req.params.authCode;
                    var _status = _currentStatus
                    var _comment = req.body.comments;
                    /**
                     * Use the cmmon date handler to return the timestamp in a more usable
                     * format for the database
                     */
                    var _statusDate = datetime.syncCurrentDateTimeforDB(); 
                   
                   
                    var strSQL1 =  'INSERT into DeviceHistory (AuthCode, Status, StatusDate, StatusChangeComment) VALUES("'+_authCode+'", "'+_status+'", "'+_statusDate+'", "'+_comment+'")';
                    console.log('INSERT strSQL1= '+ strSQL1);  

                      connection.query(strSQL1, function(err, rows) {
                           if (err) {
                            //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                            
                              console.log('results of devicehistory insert '+err);
                              
                              }else{                                   
                            
                              }
                             
                              connection.end();
                              res.status(301).redirect('/devices');
                             // res.redirect('devices', { title: 'Command Center'});

                      });

                    //res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);
                };
                });//feb--end of connection.query
        }
    });
};


///////////////////////////////////////
//* get all connections for a device //
///////////////////////////////////////

module.exports.deviceGetHistory= function(req, res) {
  sess=req.session;
  //sess.rptError =null;
  //sess.rptSuccess = null;
  // don't let nameless people view the dashboard, redirect them back to the homepage
  if (typeof sess.username == 'undefined') res.redirect('/');
  else {

            //feb--connect to the database, performa query to get all rows from people and send that data to 
            //--to be rendered as a table in Jade
            //feb- we have user entry at this point and so setting up the credentials here
            //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
             
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;
              console.log('here is the connnection '+reslt.threadId);

              var _sqlQ = 'SELECT * FROM DeviceHistory WHERE AuthCode="'+req.params.authCode+'"';
              console.log(_sqlQ);
              connection.query(_sqlQ, function(err, results) {
              if(err) { console.log('devicehistory query problem : '+err); callback(true); connection.end(); return; }

              
             // var _sqlQ = 'SELECT * FROM DeviceHistory WHERE AuthCode='+req.params.authCode;
              var authCode = req.params.authCode;
             
              connection.end();
              res.render('deviceHistory', { title: 'Command Center', results : results, authCode : authCode});
              });
        }
    });
  }
};

// handler displaying the attendance records for a particular event
module.exports.writeAttendanceRpt = function(req, res) {
  console.error('im in the write handler: '+ JSON.stringify(req.body));
  sess=req.session;
  var eventID = req.params.eventID;

  writeReport.writeReport('Attendance', eventID, function(err,reslt){  
          console.log('how about here?')
          //res.render('eventAttendance', { title: 'Command Center - Attendance', rptSuccess : sess.rptSuccess, rptError : sess.rptError});
          //res.render('eventAttendance', { title: 'Command Center 360 - Attendance', results : results, eventID : eventID, eventName : eventName, rptSuccess : sess.rptSuccess, rptError : sess.rptError});
          //res.render('eventAttendance', { title: 'Command Center - Attendance', eventID : eventID, rptSuccess : sess.rptSuccess, rptError : sess.rptError});
          //res.redirect('/events');
          console.log ('just before the redirect '+sess.rptSuccess);
          res.status(301).redirect('/eventAttendance/'+eventID);
          //res.status(301).redirect('http://google.com')


//'/?error=denied'

    
    });
 
};