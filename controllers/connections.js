//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var writeReport = require('./writeReport');



///////////////////////////////////////
//*  Display connections list screen //
///////////////////////////////////////
module.exports.connectionsHome = function(req, res) {
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

              var _sqlQ = "SELECT * FROM Connections";
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('Device query error : '+err); connection.end(); callback(true); return; }
             
              connection.end()

              res.render('connections', { title: 'Command Center', username: req.session.username, results });
              });
            }
        });
    }
};



// handler for showing simple pages
exports.eventAdd = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

    var name = req.query.name;
    
    res.render('eventAdd', { title: 'Command Center - Add Event'});
 };
};

//feb--handler for posting the event information to the database
exports.eventPostDatabase = function(req,res) {

//get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var buildEventQuery = (function() {
                      var insertEvent = function(field1, field2, field3, field4, field5,field6,field7) {
              
                      var _eventName = field1;
                      var _dateTime = field2;
                      var _locationName = field3;
                      var _sponsorName = field4;
                      var _duration = field5;
                      var _latitude= null;
                      var _longitude= null;
                      var _recordStatus=null;
                      var _invitationListID =0;

                      var _comments = field6;
                      //var _updateTime = new Date();
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _eventsType = field7;
                      console.log('here is updateTIme  '+_updateTime);
                      
                      var _qFields = '(EventName, EventDateTime, EventLocationName, EventSponsorName, DurationInMins, Latitude, Longitude, RecordStatus, Comments, updateTime, EventsType, InvitationListID)';
                      var _qValues = '("'+_eventName+'", "'+_dateTime+'", "'+_locationName+'", "'+_sponsorName+'", "'+_duration+'", "'+_latitude+'", "'+_longitude+'", "'+_recordStatus+'", "'+_comments+'", "'+_updateTime+'", "'+_eventsType+'", '+_invitationListID+')';                                                      
                      var _qUpdates = 'EventName="'+_eventName+'", EventDateTime="'+_dateTime+'"'+', EventLocationName="'+_locationName+'"'+', EventSponsorName="'+_sponsorName+'"'+', DurationInMins="'+_duration+'"'+', Latitude="'+_latitude+'"'+', Longitude="'+_longitude+'"'+', RecordStatus="'+_recordStatus+'"'+', Comments="'+_comments+'"'+', updateTime="'+_updateTime+'"'+', EventsType="'+_eventsType+'", InvitationListID='+_invitationListID;
                      var parmQuery3 = 'INSERT INTO events '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                      //console.log('parmQuery3= '+parmQuery3);
                      return parmQuery3;
               };
               return {insertEvent : insertEvent};
              })();//feb--end of revealing module

              var _eventDateTime = req.body.eventDate + ' ' + req.body.eventTime;
              //var _eventDateTime = datetime.syncFormatDateStringForDB(eventDateTime);
              console.log('here is the date   '+req.body.eventDate);
              console.log('here is the time  '+req.body.eventTime);
              console.log('here is the EVENTDATETIME  '+_eventDateTime);


              //feb--set the duration field in minutes based on the user input
              var _durationInMinutes = '';
              if (req.body.duration == '30 minutes'){
                _durationInMinutes = '30';
                }else if (req.body.duration == '1 hour'){
                    _durationInMinutes = '60';
                    }else if (req.body.duration == '90 minutes'){
                        _durationInMinutes = '90';
                        }else if (req.body.duration == '2 hours'){
                             _durationInMinutes = '120';
                                }else if (req.body.duration == '3 hours'){
                                  _durationInMinutes = '180';
                                  }else if (req.body.duration == '4 hours'){
                                    _durationInMinutes = '240';
                                  }else {_durationInMinutes = '1440'}

              console.log('duration in minutes ' + _durationInMinutes);

              var strSQL = buildEventQuery.insertEvent(req.body.eventName, _eventDateTime, req.body.eventLocationName, req.body.eventSponsorName, _durationInMinutes, req.body.comments, req.body.eventType);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {
                
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('eventAdd', { title: 'Command Center 360'});
                  } else {
                    //console.log(err);
                    console.log('INSERT  ID????'+result.insertId);

                    var eventID =  result.insertId;
                    connection.end();
                    res.status(301).redirect('/inviteListsAdd/'+eventID);
                    //res.render('inviteLists', { title: 'Command Center', eventID : lastInsertID});
                  }
              });//feb--end of connection.query
        }
    });

}; //feb--end of post handler


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
          var strSQL = 'SELECT * FROM DeviceHeader WHERE AuthCode='+req.params.authCode;
         
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
                }else if (req.body.currentStatus == 'BLACKLIST'){
                    _currentStatus = '2';
                    }else if (req.body.currentStatus == 'GRAYLIST'){
                        _currentStatus = '3';
                        }
              console.log('authCode = '+ JSON.stringify(req.params.authCode));  

              var strSQL = 'UPDATE DeviceHeader SET CurrentStatus='+_currentStatus+' WHERE AuthCode='+req.params.authCode;
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
                   
                   
                    var strSQL1 =  'INSERT into DeviceHistory (AuthCode, Status, StatusDate, StatusChangeComment) VALUES('+_authCode+', '+_status+', "'+_statusDate+'", "'+_comment+'")';
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

              var _sqlQ = 'SELECT * FROM DeviceHistory WHERE AuthCode='+req.params.authCode;
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