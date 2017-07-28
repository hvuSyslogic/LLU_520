var mysql    = require('mysql');
var fs  = require('fs');
var clearTables = require('../models/clearTables');
var db = require('../models/db');
var people = require('../models/people');
var empBadge = require('../models/empBadge');
var accessLevel = require('../models/accesslevels');
var inviteList = require('../models/inviteList');
var csvImportInsertS2 = require('./csvImportInsertS2');
var csvParser = require('csv-parse');
var path = require( 'path' );


exports.insertInvite = function(connection, csvFileName, listName, listComment, callback) {
  //sess.success = null;
 // sess.error = null;
  var strSQL = "";
  var query = null;

  
        
         // Not sure if we need to clear any invitee records before import
         // Presumably, we need to create a header record and then import the 
         // records in the headers associated invitees file

                     
          // Create the InviteList first, and then if successful, 
          // INSERT the csv into the invitees table

          inviteList.createInviteList(connection, listName, listComment, function(err,rslt){
            if (err) {
              console.log('Error while performing people table clear: ' + err);
              //sess.error = 'There was a problem creating the InviteList the table';
              connection.end();
              callback(err, null);
            }else{

                        //console.log(req.body.fileName);
                //fs.readFile(req.body.directoryName+req.body.fileName, {
                fs.readFile(csvFileName, {
                //fs.readFile(req.body.fileName, {
                    encoding: 'utf-8'
                  }, function(err, csvData) {
                        if (err) {
                        sess.error = 'File not found.  Please check directory and file name.';
                        callback(err, null);
                        }

                    csvParser(csvData, {
                      delimiter: ',',
                      escape: "'"
                      //columns: true
                      }, function(err, data) {
                        if (err) {
                            console.log(err);
                            sess.error = 'csv file problem -- '+err;
                            callback(err, null);
                        } else {
                            
                            var numRows = data.length
                            console.log('length of file is '+data.length);
                            /**
                             * Format the date.  Timestamp for the db and then late needs to be converted to display
                             * format whenever needed for screen display.
                             * Was previously using CURRENT_TIMESTAMP in the INFILE SQL statement but this produces a long
                             * spelled out date and time
                             */
                            //var _updateTime = new Date();  // this one produces a very long string, too long for legacy installs
                            var _d = new Date();
                            var _t = _d.getTime(); 
                            var _updateTime = _t;
                            
                            for (var i=1; i < data.length; i++) {

                              
                                var escapeName = connection.escape(data[i][1]);
                                var escapeFirstName = connection.escape(data[i][2]);
                                var invSQL = "INSERT into Invitees (InvitationListID, BadgeNumber, LastName, FirstName, EmailAddress, NotificationNumber, NumberFormat, UpdateTime) VALUES (LAST_INSERT_ID(),"+"'"+data[i][4]+"', "+ escapeName+", "+ escapeFirstName+", '', 0,'',"+_updateTime+")";
                                console.log('the sql string '+ invSQL);
                                
                                console.log('the escape sql string '+ escapeName);

                                query = connection.query(invSQL, function(err, resultt) {

                                  if (err) {
                                    console.log('Error while performing invitee insert : ' + err);
                                    callback(err,null);
                                  }else{

                                  }
                                });
                              }

                            callback(null, "success");

                                
                     }; //feb--end of else in csvParser
                  }); //feb--end of csvParser 
                }); //feb--end of fs.readfile
            }
          });



        
    };

/////////////////////////////////////////////////////////////////////////////
// Recreate the people, empbadge and accesslevels tabless from the csv file //
/////////////////////////////////////////////////////////////////////////////

exports.insertPeople = function(csvFileName, callback) {
  //sess.success = null;
 // sess.error = null;
  var strSQL = "";
  var query = null;
  sess.error = null;

  console.log('INSERT PEOPLE HANDLER')

  /**
   * Use a different connection for each table for faster inserts
   */

  db.createConnection(function(err,res1){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = res1;
          console.log('here is the csvImport PEOPLE connnection '+res1.threadId);
          db.createConnection(function(err,res2){  
              if (err) {
                console.log('Error while performing common connect query: ' + err);
                callback(err, null);
              }else{
                //process the i/o after successful connect.  Connection object returned in callback
                var connectionEB = res2;
                console.log('here is the csvImport empBadge connnection '+res2.threadId);
                db.createConnection(function(err,res3){  
                  if (err) {
                    console.log('Error while performing common connect query: ' + err);
                    callback(err, null);
                  }else{
                    //process the i/o after successful connect.  Connection object returned in callback
                    var connectionAL = res3;
                    console.log('here is the csvImport accesslevels connnection '+res3.threadId);

          /**
           * Clear the people, empbadge and accesslevel tables 
           */
          clearTables.clearAllFromTable(connection, 'people', function(err,rslt){
          if (err) {
            console.log('Error while performing people table clear: ' + err);
            connection.end();
            callback(err, null);
          }else{
              clearTables.clearAllFromTable(connection, 'empbadge', function(err,rslt){
                if (err) {
                  console.log('Error while performing empbadge table clear: ' + err);
                  connection.end();
                  callback(err, null);
                }else{
                  clearTables.clearAllFromTable(connection, 'accesslevels', function(err,rslt){
                    if (err) {
                      console.log('Error while performing accesslevels table clear: ' + err);
                      connection.end();
                      callback(err, null);
                    }else{

                      /**
                       * Loop through the csv file and create a people record for each entry
                       * First determine the format of the csv file.
                       * Current options are:
                       * - S2 (insert only)
                       * - mobss-stipulated (insert of infile)
                       * - AMAG (infile only)
                       */

                         switch (process.env.EXPORT_SOURCE)
                          {
                             case "S2":
                             /**
                              * Process the S2 format types in a separate handler.
                              * Requires special parsing operations as the credential field on the csv
                              * contains multiple card numbers and multiple bits of information in
                              * one long string
                              * 
                              */
                                csvImportInsertS2.processInsert(connection, connectionEB, connectionAL, csvFileName, function(err,rslt){
                                  if (err){
                                    console.log('Unsuccessful import');
                                    //sess.error = 'Unsuccessful import attempt'
                                  }else{
                                    sess.success="Successful import of CSV file"
                                  }
                                  callback(sess.error, sess.success);

                                });
                                break;

                            default: 
                             
                          /**
                           * mobss-stipulated csv file format
                           * 
                           */
                            fs.readFile(csvFileName, {
                            //fs.readFile(req.body.fileName, {
                                encoding: 'utf-8'
                              }, function(err, csvData) {
                                    if (err) {
                                    sess.error = 'File not found.  Please check directory and file name.';
                                    callback(err, null);
                                    }

                              csvParser(csvData, {
                                delimiter: ',',
                                escape: "'"
                                //columns: true
                                }, function(err, data) {
                                  if (err) {
                                console.log(err);
                                    sess.error = 'csv file problem -- '+err;
                                    callback(err, null);
                                } else {
                                    
                                    var rowsToInsert = data.length-1
                                    console.log('length of FIEL:iNSERT is '+data.length+rowsToInsert);
                                    var _firstName = ""
                                    var _lastName = ""
                                    var _badgeNumber = ""
                                    var _title = ""
                                    var _empID = 0
                                    var _imageName = ""
                                    var counter = 0;
                                    var errInsert =null;

                                    for (var i=1; i < data.length; i++) {
                                 
                                      _firstName = data[i][2];
                                     _lastName = data[i][1]
                                     /**
                                      * Blank field in the csv will show up as " ", ie a field length of 1
                                      * and then casue error if the target database field for this csv field is an integer.
                                      * So test the csv fields assocaited with integers for " " (blank field entry in csv) and
                                      * change to 0 if positive.  Null not permitted for accesslevels and empbadge tables
                                      */
                                      if (data[i][4] ==" " || data[i][4].length ==0){_badgeNumber = 0}else{_badgeNumber = data[i][4]}
                                      console.log('badgeNumber.length '+JSON.stringify(data[i][4].length))
                                     //_badgeNumber = data[i][4]
                                    
                                      if (data[i][0] ==" "|| data[i][0].length ==0){_empID = 0}else{_empID = data[i][0]}
                                      console.log('empID.length '+JSON.stringify(data[i][0].length))

                                     _title = data[i][3]
                                     _imageName = data[i][5]
                                   

                                      /**
                                       * Use the common module for the people I/O
                                       */
                                      people.createPeopleRecord(connection, _firstName, _lastName, _badgeNumber, _title, _empID, _imageName, function(err,rslt){

                                        /**
                                         * The creatPeopleRecord function is called for each record in the csv file.
                                         * The createPeopleRecord itself makes the insert asynchronously  and each time
                                         * it comes through that callback it will test for an error and drop back to here.
                                         * Once it has dropped back to here for the final time - ie all the inserts have 
                                         * been attempted, we callback to the csv.js parent with the final result
                                         * Note we are using a counter to track the number of times the createPeopleRecord 
                                         * callback with results.  Then if there has been an error (in any of the insert 
                                         * record attempts), We simply pass that back to the parent function
                                         * 
                                         */
                                          counter++;
                                          /**
                                           * only pass back the first encountered error.
                                           * this should allow us to destroy the connection
                                           * at the first error and therefore finish processing
                                           * quicker in event of an error
                                           * 
                                           */
                                          if (err) { if (errInsert==null){errInsert=err; sess.error = 'Error inserting a csv record '+err;}}
                                          //console.log('THE COUNTER IN CSVIMPORTINSERT '+counter)
                                          //console.log('THE errInsert IN CSVIMPORTINSERT '+errInsert)

                                          
                                        
                                          if (counter == rowsToInsert){
                                            sess.success==null;
                                            
                                          if (errInsert==null) {
                                            var query = connection.query('select count(*) as rowCount from people', function(err, result) {

                                              console.log ('here is rowcount '+JSON.stringify(result[0].rowCount))

                                              if (!err) {sess.success = ' : '+result[0].rowCount+' cardholders'}; 

                                              console.log('READY NOW'+sess.success); 
                                              connection.end()
                                              callback(errInsert, sess.success);
                                        
                                            });   

                                          }
                                          
                                        };

                                      }); // end of createPeopleRecord

                                      /**
                                       * Create the empbadge table using a separate connection 
                                       */
                                      var status="Active";
                                      empBadge.createEmpBadge(connectionEB, _badgeNumber, _empID, status, function(err,resllt){
                                        if (err){console.log('EmpBadge was NOT created properly')}
                                      });
                                      /**
                                       * Create the accesslevels table using a separate connection 
                                       */
                                      accessLevel.createAccessLevel(connectionAL, _badgeNumber, _empID, function(err,resllt){
                                        if (err){console.log('Accesslevels was NOT created properly')}
                                      });

                                      
                                    } // end of for loop through the csv file     
                         }; //feb--end of else in csvParser
                      }); //feb--end of csvParser 
                    }); //feb--end of fs.readfile
                    } //end of the case statement 
           }// end of the third cleartables if else
          });
         }
        });
       }
      });//end of first cleartables
     
}
});      

}
});

}
});
}