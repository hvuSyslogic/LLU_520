var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');



// handler displaying the attendance records for a particular event
module.exports.writeReport = function(report, itemID, callback) {
 

          //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
          if (err) {
            callback(err, null);
          }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
            console.log('here is the connnection '+reslt.threadId);

            // Run the attendance report
            if (report == 'Attendance') {
              var eventID = itemID;
              module.exports.writeAttendanceReport (connection, eventID, function(err,reslt){  
                callback(sess.rptError, sess.rptSuccess);
                return;
            });
          }
            // Run the cardscans report
            if (report == 'Cardscans') {
              var badgeID = itemID;  
            
              module.exports.writeCardscanReport (connection, badgeID, function(err,reslt){  
                callback(sess.rptError, sess.rptSuccess);
                return;

              });   
            } 

           };
      });
};

// handler displaying the attendance records for a particular event
module.exports.writeAttendanceReport = function(connection, eventID, callback) {

           
            var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+eventID;
            console.log(_sqlQ);
            connection.query(_sqlQ, function(err, results) {
              //connection.release();
              if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }

              var eventID = eventID;
              var eventName = "";
              if(results.length > 0){
                var eventName = results[0].EventName;
                var title='Attendance Report -- '+eventName;
                var appPath = path.normalize(__dirname+'/..');
                var rptPath = path.normalize(appPath+'/public/reports/');
                //fs.open('./'+title+'.csv', 'wx', (err) => {
                fs.open(rptPath+title+'.csv', 'wx', (err, fd) => {
                  if (err) {
                    if (err.code === "EEXIST") {
                      console.error('myfile already exists');
                      sess.rptSuccess = null;
                      //sess.rptError = "No report generated, file already exists in "+rptPath+".  To re-generate, delete the existing report first."
                      sess.rptError = "Report already exists";
                      connection.end();
                      callback(sess.rptError, sess.rptSuccess);

                      return;
                    } else {
                      throw err;
                    }
                  }
              
                var wstream = fs.createWriteStream(rptPath+title+'.csv');
                  
          //var title='ATTENDANCE REPORT FOR EVENT '+req.params.eventID;+"\n";
          //var header="col1"+","+" Age"+","+"Name"+"\n";
                var header='Last Name'+','+ 'First Name'+','+'Attendance Date'+','+'Time In'+','+'Time Out'+','+'Badge ID'+'\n';
          
                wstream.write(header);
                wstream.write('\n');


                for (i=0; i<results.length; i++) {
                    wstream.write(results[i].LastName+','+ results[i].FirstName+','+results[i].AttendDate+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+'\n');
                }
                wstream.write('\n');
                wstream.end();
                sess.rptError =null;
                //sess.rptSuccess = "'"+title+'.csv'+"'"+ ' has been generated in location '+rptPath;
                sess.rptSuccess =  'Report has been generated'

                connection.end();
                // Used an fs.open so need to close the file,  other functions close after operation but 
                // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
                // before i just had err in the callback
                fs.close(fd, function(err){         
                  if (err){            
                    console.log(err);
                  }
                    console.log("File closed successfully.");
                  }); 

                callback(sess.rptError, sess.rptSuccess);
              
              });  //END of fs open

              }else {
                sess.rptSuccess = null;
                sess.rptError = "No report generated."
                connection.end();
                callback(sess.rptError, sess.rptSuccess);
                return;
                //res.render('eventAttendance', { title: 'Command Center - Attendance', results : results, eventID : eventID, eventName : eventName, rptSuccess : sess.rptSuccess, rptError : sess.rptError});
              };
            });
    
};

// handler displaying the cardscan records for a particular badge
module.exports.writeCardscanReport = function(connection, badgeID, callback) {
  console.error('im in the cardscan write handler: '+ badgeID);

          
      var _sqlQ = 'SELECT * FROM verifyrecords WHERE BadgeID='+badgeID;
            console.log(_sqlQ);
            connection.query(_sqlQ, function(err, results) {
              //connection.release();
              console.log('full set of VR results are: ' + JSON.stringify(results));
              if(err) { console.log('verifyrecords query bad'+err); callback(true); connection.end(); return; }

              if(results.length > 0){
                var empID = results[0].EmpID;
                
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!
                var yy = today.getFullYear();

                today = mm+'-'+dd+'-'+yy;
               
                var title='Cardscan Report - Generated '+today+'- for BadgeID '+badgeID;
                var appPath = path.normalize(__dirname+'/..');
                var rptPath = path.normalize(appPath+'/public/reports/');
                //fs.open('./'+title+'.csv', 'wx', (err) => {
                fs.open(rptPath+title+'.csv', 'wx', (err, fd) => {
                  if (err) {
                    if (err.code === "EEXIST") {
                      console.error('myfile already exists');
                      sess.rptSuccess = null;
                      //sess.rptError = "No report generated, file already exists in "+rptPath+".  To re-generate, delete the existing report first."
                      sess.rptError = "Report already exists";

                      connection.end();
                      callback(sess.rptError, sess.rptSuccess);

                      return;
                    } else {
                      throw err;
                    }
                  }
              
                var wstream = fs.createWriteStream(rptPath+title+'.csv');

                var header='Scan Time'+','+'Employee ID'+','+'Result'+','+'Reader'+','+'Operator'+'\n';
          
                wstream.write(header);
                wstream.write('\n');


                for (i=0; i<results.length; i++) {
                  console.log('the reporter results length is '+results.length);
                  console.log('wstream data :'+results[i].ScanDateTime);
                  var resultField = null;
                  if (results[i].result == '1') {resultField = "Approved"}else{resultField="Denied"}

                  wstream.write(results[i].ScanDateTime+','+results[i].EmpID+','+resultField+','+results[i].ClientSWID+','+results[i].MobSSOperator+'\n');
                }
                wstream.write('\n');
                wstream.end();
                sess.rptError =null;
                //sess.rptSuccess = "'"+title+'.csv'+"'"+ ' has been generated in location '+rptPath;
                sess.rptSuccess =  'Report has been generated'
                connection.end();
                
                // Used an fs.open so need to close the file,  other functions close after operation but 
                // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
                // before i just had err in the callback
                fs.close(fd, function(err){         
                  if (err){            
                    console.log(err);
                  }
                    console.log("File closed successfully.");
                  }); 

                callback(sess.rptError, sess.rptSuccess);
                
              });  //END of fs open

              }else {
                sess.rptSuccess = null;
                sess.rptError = "No report generated."
                connection.end();
                callback(sess.rptError, sess.rptSuccess);
                return;
              };
            });
    
 
};