var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var emailController = require('../controllers/emailController');




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
              console.log('results for event 75 '+JSON.stringify(results))
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
                  
          /**
           * Add email to the report [plus identifier field], as per BCBS {for ACM} request.
           * These fields are in the PEOPLE table, so i/o to the people table and then loop
           * through the array to find the match on iClassNumber between the attendance table and
           * the people tables results.
           */

          
                var header='Last Name'+','+ 'First Name'+','+'Attendance Date'+','+'Email'+','+'Time In'+','+'Time Out'+','+'Badge ID'+','+'Identifier'+','+'\n';
          
                wstream.write(header);
                wstream.write('\n');
                var emailField=""
                var index = ""
                var identifier=""


                var _sqlQ1 = 'SELECT EmailAddr, Identifier1, iClassNumber FROM people';
                connection.query(_sqlQ1, function(err, results1) {
                  if(err) { console.log('email query bad'+err);}

                  //loop through the attendance records, finding the Email and Identifier fields
                  //and then writing out the report line
                  for (i=0; i<results.length; i++) {  

                  // Populate the email and Identifier fields for the report output

                      for(var j = 0; j < results1.length; j++) {
                           if(results1[j].iClassNumber === results[i].iClassNumber) {
                             index = j;
                           }
                        }
                    //populate the email and identifier fields if found, otherwise leave them blank
                    if (index != ""){emailField = results1[index].EmailAddr; identifier = results1[index].Identifier1}

                    console.log('results of array search '+emailField+' '+identifier)

                    wstream.write(results[i].LastName+','+ results[i].FirstName+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');

                  }
                  // end the report once the loop is done but still inside the PEOPLE i/o Async
                  wstream.write('\n');
                  wstream.end();
                  
                  });
                
                
                sess.rptError =null;
                sess.rptSuccess =  'Report has been generated'

                // Used an fs.open so need to close the file,  other functions close after operation but 
                // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
                // before i just had err in the callback
                fs.close(fd, function(err){         
                  if (err){            
                    console.log(err);
                  }
                    console.log("File closed successfully.");
                    // email the user support if there is a problem connecting to the database
                    // Get the user's email, using the session username from log-in and their 
                    // email from the USERS db table
                    var userName= JSON.stringify(sess.username)

                    var _sqlQ1 = 'SELECT UserEmail FROM Users WHERE UserName='+userName;
                    connection.query(_sqlQ1, function(err, resultU) {
                      if(err) { console.log('email query bad'+err); connection.end();}
                      else{
                        if (resultU[0].UserEmail !=""){
                          console.log('inside the email loop?'+ JSON.stringify(resultU[0].UserEmail))
                          var fullFileName = title+'.csv'  
                          emailController.sendAttendanceEmail('Attendance Report -- '+eventName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                          if (err) {console.log('a problem occurred, attempting to email customer support')}
                          });
                          }
                          connection.end()
                          callback(sess.rptError, sess.rptSuccess);

                      }

                  });
                  }); 

              
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