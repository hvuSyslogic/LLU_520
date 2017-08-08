//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var writeReport = require('./writeReport');



// handler for processing csv file ingest submit request
module.exports.eventsHome = function(req, res) {
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
              console.log('here is the connnection '+reslt.threadId);

              var _sqlQ = "SELECT * FROM events where EventDateTime < NOW()";
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('event query bad'+err); connection.end(); callback(true); return; }
              //console.log("Meta query results are "+ JSON.stringify(results));
              //console.log("Meta query results are "+ results[0].maxTime);
              connection.end()
              //sess.time = results[0].maxTime;

              res.render('events', { title: 'Command Center - Events', username: req.session.username, results });
              });
            }
        });
        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};

// handler for processing csv file ingest submit request
module.exports.eventsUpComing = function(req, res) {
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
            console.log('here is the connnection '+reslt.threadId);

            var _sqlQ = "SELECT * FROM events where EventDateTime >= CURDATE()";
            connection.query(_sqlQ, function(err, results) {
           
             if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
              
            connection.end();
            res.render('eventsUpcoming', { title: 'Command Center - Upcoming Events', username: req.session.username, results });
            });
          }
      });  

        //res.render('cardholders', { title: 'Command Center 360 - ' });
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


module.exports.eventGetOne = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          console.log('eventId param '+req.params.eventID);
          var strSQL = 'SELECT * FROM events WHERE EventID='+req.params.eventID;
          console.log('here is the query string' + strSQL);
          //console.log('strSQL= '+ strSQL);  
          var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    connection.end();
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    res.render('events', { title: 'Command Center 360'});
                  } else {
                    console.log('here is the event name ' + result[0].EventName);
                    console.log('here are the comments ' + result[0].Comments);
                    var displayDate = datetime.syncGetDateInDisplayFormat(result[0].EventDateTime);
                    var displayTime = datetime.syncGetTimeInDisplayFormat(result[0].EventDateTime);
                   
                    //get the invite ListName for display
                    var inviteListName = '';
                    console.log('here is the value of the invite list ID '+result[0].InvitationListID);
                    if (result[0].InvitationListID > 0) {
                      console.log('getting inside????????');
                    var strSQL2 = 'SELECT ListName FROM InviteList WHERE InvitationListID='+result[0].InvitationListID;
                              
                              var query = connection.query(strSQL2, function(err, result2, calllback) {

                                     if (err) {
                                        inviteListName = 'No name found for this invite list';
                                       
                                      } else {
                                        console.log('return values '+result2.ListName+' '+result2[0].ListName);
                                        inviteListName = result2[0].ListName;
                                        console.log('display date is as follows : ' + displayDate);
                                        console.log('display time is as follows : ' + displayTime);
                                        connection.end();
                                        console.log('LIST NAME '+inviteListName);
                                        res.render('eventModify', { title: 'Command Center 360 - events', result, displayDate : displayDate, displayTime : displayTime, inviteListName : inviteListName });
                                      }
                              });
                    }else{
                      //0 value means no invite list has been attached yet
                      inviteListName = 'No invite list for this event'
                      console.log('display date is as follows : ' + displayDate);
                      console.log('display time is as follows : ' + displayTime);
                      connection.end();
                      console.log('LIST NAME '+inviteListName);
                      res.render('eventModify', { title: 'Command Center 360 - events', result, displayDate : displayDate, displayTime : displayTime, inviteListName : inviteListName });

                    }
  

                    
                };
                });//feb--end of connection.query
        }
    });
};
}; // end of handler


////////////////////////////////////////////////
// update the database with the modifications //
////////////////////////////////////////////////
exports.eventUpdateOne = function(req, res) {
  sess=req.session;
    var name = req.query.name;

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var buildEventQuery = (function() {
                    var updateEvent = function(field1, field2, field3, field4, field5,field6,field7,field8) {
    
                      var _eventName = field1;
                      var _dateTime = field2;
                      var _locationName = field3;
                      var _sponsorName = field4;
                      var _duration = field5;
                      var _latitude= null;
                      var _longitude= null;
                      var _recordStatus=null;

                      var _comments = field6;
                      //var _updateTime = new Date();
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _eventsType = field7;
                      var _eventID = field8;
                      console.log('here is updateTIme  '+_updateTime);
                      
                      var _qFields = '(EventName, EventDateTime, EventLocationName, EventSponsorName, DurationInMins, Latitude, Longitude, RecordStatus, Comments, updateTime, EventsType)';
                      var _qValues = '("'+_eventName+'", "'+_dateTime+'", "'+_locationName+'", "'+_sponsorName+'", "'+_duration+'", "'+_latitude+'", "'+_longitude+'", "'+_recordStatus+'", "'+_comments+'", "'+_updateTime+'", "'+_eventsType+'")';                                                      
                      var _qUpdates = 'EventName="'+_eventName+'", EventDateTime="'+_dateTime+'"'+', EventLocationName="'+_locationName+'"'+', EventSponsorName="'+_sponsorName+'"'+', DurationInMins="'+_duration+'"'+', Latitude="'+_latitude+'"'+', Longitude="'+_longitude+'"'+', RecordStatus="'+_recordStatus+'"'+', Comments="'+_comments+'"'+', updateTime="'+_updateTime+'"'+', EventsType="'+_eventsType+'"';
                      var parmQuery3 = 'UPDATE events SET '+_qUpdates+' WHERE EventID='+_eventID;
                      //console.log('parmQuery3= '+parmQuery3);
                      return parmQuery3;
               };
               return {updateEvent : updateEvent};
              })();//feb--end of revealing module

 
              var _eventDateTime = req.body.eventDate + ' ' + req.body.eventTime;
              //var _eventDateTime = datetime.syncFormatDateStringForDB(eventDateTime);

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

              var strSQL = buildEventQuery.updateEvent(req.body.eventName, _eventDateTime, req.body.eventLocationName, req.body.eventSponsorName, _durationInMinutes, req.body.comments, req.body.eventType, req.params.eventID);
              console.log('update strSQL= '+ strSQL);  

              var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('eventAdd', { title: 'Command Center 360'});
                  } else {
                    //console.log(err)
                            var invitationListID = '';
                            var strSQL1 =  "SELECT InvitationListID from events where EventID="+req.params.eventID;
                              connection.query(strSQL1, function(err, rows) {
                                   if (err) {
                                    //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                                    
                                      console.log('results of quert'+JSON.stringify(rows));
                                      
                                      }else{
                                          invitationListID = rows[0].InvitationListID === 0 ? 'No invite list' : rows[0].InvitationListID;
                                           
                                    
                                          //res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);
                                      }
                                    //REgardless of result of InvitationListID lookup, we are heading for the list change screen
                                    connection.end();
                                    res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);

                                    });

                    //res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);
                };
                });//feb--end of connection.query
        }
    });
   // res.render('/events', { title: 'Command Center 360 - Event List'});
};



// handler for showing simple pages
exports.eventAddInviteList = function(req, res) {
  sess=req.session;
    var name = req.query.name;
  console.log('here are the PARAMS for the UPDATE '+req.params.eventID+' '+req.params.InvitationListID);

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          /**
           * When an event is added with no invite list, the app complans
           * it is not getting enough felds (12 instead of 13), and the server
           * side db shows NULL in a different way than the other fields
           *
           */
            var _invitationListID = 0;
            console.log('the parm '+JSON.stringify(req.params.InvitationListID))
            if (req.params.InvitationListID ==" " || req.params.InvitationListID ==undefined){_invitationListID = 0}else{_invitationListID = req.params.InvitationListID}

              var strSQL = 'UPDATE events SET InvitationListID='+_invitationListID+' WHERE eventID='+req.params.eventID;
              console.log('update INVITELIST ID strSQL= '+ strSQL);  

              var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.redirect('/eventsUpcoming');
                  } else {
                    //console.log(err);
                    connection.end();
                    sess.success = 'New invitation list attached for this event'; 
                    res.redirect('/eventsUpcoming');
                };
                });//feb--end of connection.query
        }
    });
   // res.render('/events', { title: 'Command Center 360 - Event List'});
};

// handler for showing simple pages
exports.eventChangeInviteList = function(req, res) {
  sess=req.session;
    var name = req.query.name;
  console.log('here are the PARAMS for the UPDATE '+req.params.eventID+' '+req.params.InvitationListID);

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          
            var _invitationListID = 0;
            if (req.params.InvitationListID ==" " || req.params.InvitationListID ==undefined){_invitationListID = 0}else{_invitationListID = req.params.InvitationListID}

              var strSQL = 'UPDATE events SET InvitationListID='+_invitationListID+' WHERE eventID='+req.params.eventID;
             // var strSQL = 'UPDATE events SET InvitationListID='+req.params.InvitationListID+' WHERE eventID='+req.params.eventID;
              console.log('update INVITELIST ID strSQL= '+ strSQL);  

              var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.redirect('/eventsUpcoming');
                  } else {
                    //console.log(err);
                    connection.end();
                    res.redirect('/eventsUpcoming');
                };
                });//feb--end of connection.query
        }
    });
   // res.render('/events', { title: 'Command Center 360 - Event List'});
};

// handler displaying the attendance records for a particular event
module.exports.eventAttendance = function(req, res) {
  sess=req.session;
 
  // don't let nameless people view the dashboard, redirect them back to the homepage
  if (typeof sess.username == 'undefined') res.redirect('/');
  else {

            //connect to the database, perform query to get all rows from people and send that data to 
            //to be rendered as a table in Jade
            //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
             
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;
              console.log('here is the connnection '+reslt.threadId);

              var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+req.params.eventID;
              console.log(_sqlQ);
              connection.query(_sqlQ, function(err, results) {
              //connection.release();
              if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }

              var eventID = req.params.eventID;
              var eventName = "";
              if(results.length > 0){
              var eventName = results[0].EventName;
              }
            
              connection.end();
              res.render('eventAttendance', { title: 'Command Center - Attendance', results : results, eventID : eventID, eventName : eventName});
              });
        }
    });
  }
};

// Handler for the attendance report.  This is 
// handler displaying the attendance records for a particular event
exports.writeAttendanceRpt = function(req, res) {
  console.error('im in the write handler: '+ JSON.stringify(req.body));
  sess=req.session;
  var eventID = req.params.eventID;


  writeReport.writeReport('Attendance', eventID, function(err,reslt){  
          console.log('how about here?')
          
          console.log ('just before the redirect '+sess.rptSuccess);
          res.status(301).redirect('/eventAttendance/'+eventID);

  });
 
};