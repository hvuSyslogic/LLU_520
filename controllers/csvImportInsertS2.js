var mysql    = require('mysql');
var fs  = require('fs');
var clearTables = require('../models/clearTables');
var db = require('../models/db');
var people = require('../models/people');
var empBadge = require('../models/empBadge');
var accessLevel = require('../models/accesslevels');
var inviteList = require('../models/inviteList');
var csvParser = require('csv-parse');
var path = require( 'path' );
var strSQL = "";
var query = null;

////////////////////////////////////////////////////////////////
// Processes the PEOPLE, EMPBADGE, ACCESSLEVELS insert for S2 //
////////////////////////////////////////////////////////////////
exports.processInsert = function(connection, connectionEB, connectionAL, caller, csvFileName, callback) {

    console.log('inside S2 csvfilename'+csvFileName)

    fs.readFile(csvFileName, {
        encoding: 'utf-8'
      }, function(err, csvData) {
            if (err) {
            if (caller == "manual"){sess.error = 'File not found.  Please check directory and file name.'};
            callback(err, null);
            }
        /**
         * Can only escape one character (according to docs on the csv-parse module)
         * Escape quotation marks -- this is the default and so no need fo the escape clause
         * Seems to be fine with commas and  spostrophes within  the data fields
         */
        csvParser(csvData, {
          delimiter: ',',
          // escape: "'"
          //columns: true
          }, function(err, data) {
            if (err) {
                console.log(err);
                // process the error differently if this module is called from the sweep or
                // from the manual (screen) processing.  if sweep, might not have the sess object defined
                if (caller == "manual"){sess.error = 'csv file problem -- '+err};
                callback(err, null);
            } else {
                
                var numRows = data.length
                var rowsToInsert = data.length-1
                if (caller == "manual"){sess.error = null; sess.success=null};
                console.log('length of file is '+data.length);
                /**
                 * Format the date.  Timestamp for the db and then late needs to be converted to display
                 * format whenever needed for screen display.
                 * Was previously using CURRENT_TIMESTAMP in the INFILE SQL statement but this produces a long
                 * spelled out date and time
                 */
              
                /**
                 * csv-parser reads through the csv file and moves the contents to an array
                 * that is addessable in the normal manner
                 */
                 

                var _d = new Date();
                var _t = _d.getTime(); 
                var _updateTime = _t;
                var firstName = "";
                var lastName = "";
                var badgeNumber = 0;
                var title = "";
                var empID = "";
                var image ="";
                var counter = 0;
                var errInsert =null;

                for (var i=1; i < data.length; i++) {

                  
                   
                    console.log ("The csv parse " +JSON.stringify(data[i][5]))
                    firstName = data[i][5];
                    lastName = data[i][6];
                    badgeNumber = 0;
                    title = "";
                    empID = data[i][1];
                    image = data[i][7];

                    /**
                     * Isolate all the badge credential substrings (delimited by pipe |)
                     * from the main credential field.
                     * This will produce an arrray where each row is an individual badge
                     */
                    var credStr = data[i][4];
                  
                    var credArr = credStr.split("|");
                    console.log ("The pipe parse "+JSON.stringify(credArr))

                    
                     /**
                     * Isolate the cardnumber.  The cardnumber is repeated at the beginning of the 
                     * credentials badge string and the second instance is preceded by a ~ (tilde).
                     * For each row (as split by pipe aboce), split the row string on tilde to
                     * isolate cardnumberand card status.
                     */
                   
                    for (var j=0; j < credArr.length; j++) {

                        /**
                         * If there is a single array entry for the credential and it is blank,
                         * set the badgeNumber to 0 and Inactive
                         *
                         */
                        if (credArr[0] ==" " || credArr[0].length ==0){
                          var badgeNumber=0
                          var status = "Blank"
                        }else{
                          var cardStr = credArr[j];
                          var cardArr = cardStr.split("~");
                          console.log ("The tilde parse " + JSON.stringify(cardArr))
                          console.log ("card number isolation "+JSON.stringify(cardArr[1]))
                          console.log ("card status " + JSON.stringify(cardArr[3]))

                          if (cardArr[3] == "Expired") {
                            console.log ("Card Expired")
                          }
                          badgeNumber = cardArr[1];
                          status = cardArr[3];
                        }

                        people.createPeopleRecord(connection, firstName, lastName, badgeNumber, title, empID, image, function(err, res2){
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
                          if (err) { if (errInsert==null){errInsert=err; if (caller=="manual"){sess.error = 'Error inserting a csv record '+err;}}}

                          if (counter == rowsToInsert){
                            if (caller=="manual"){sess.success==null};

                            if (errInsert==null) {
                                ////////////////////////////////////////////////////////////////
                                // Remove any imported .jpg extension from the ImageName      //
                                ////////////////////////////////////////////////////////////////
                                /**
                                 * Need to do this for .jpg and .JPG and .jpeg and .JPEG
                                 */
                                
                                var jpgSQL = "update people set imageName = replace(replace(replace(replace(imageName,'.jpg',''),'.JPG',''), '.jpeg', ''), '.JPEG', '')"
                                //var jpgSQL = "UPDATE people SET imageName = REPLACE(imageName, '.JPG', '')"
                                query = connection.query(jpgSQL, function(err, result) {

                                  if (err) { console.log('couldnt remove the .jpg extensions '+err);}
                                   
                                });

                                // get the row count for confirmation message
                                var query = connection.query('select count(*) as rowCount from people', function(err, result) {

                                  console.log ('here is S2 rowcount '+JSON.stringify(result[0].rowCount))

                                  if (!err) {
                                    connection.end()
                                    if (caller=="manual"){
                                        sess.success = ' : '+result[0].rowCount+' cardholders';
                                        callback(errInsert, sess.success)}
                                    else{callback(errInsert, null);}

                                  }else{
                                    connection.end()
                                    callback(errInsert, null);
                                  }
                                  
                            
                                });


                                
                                
                            }
                          }  

                        });
                        /**
                         * Create the empbadge table using a separate connection 
                         */
                        empBadge.createEmpBadge(connectionEB, badgeNumber, empID, status, function(err,resllt){
                          if (err){
                            if (caller=="manual"){
                                if (sess.error==null) {sess.error=err}
                            }
                            console.log('EmpBadge was NOT created properly')}

                        });
                        /**
                         * Create the accesslevels table using a separate connection 
                         */
                        accessLevel.createAccessLevel(connectionAL, badgeNumber, empID, function(err,resllt){
                         if (err){
                            if (caller=="manual"){
                                if (sess.error==null) {sess.error=err}
                            }
                            console.log('accesslevels was NOT created properly')}
                        });
                       
                    }
                    
                  }
                  
                 // if (caller=="manual"){callback(sess.error,null)}
                   // else{ callback (err, null)}


                    
         }; //feb--end of else in csvParser
      }); //feb--end of csvParser 

    }); //feb--end of fs.readfile
}


///////////////////////////////////////////////////////
// Process the INVITELIST and INVITEES insert for S2 //
///////////////////////////////////////////////////////
exports.insertInvite = function(connection, csvFileName, listName, listComment, callback) {

console.log('inside S2 INVITE INSERT csvfilename'+csvFileName)

    
// Create the InviteList first, and then if successful, 
// INSERT the csv into the invitees table

inviteList.createInviteList(connection, listName, listComment, function(err,rslt){
if (err) {
  console.log('Error while performing create INVITELIST: ' + err);
  //sess.error = 'There was a problem creating the InviteList the table';
  connection.end();
  callback(err, null);
}else{

    fs.readFile(csvFileName, {
        encoding: 'utf-8'
      }, function(err, csvData) {
            if (err) {
            callback(err, null);
            }
        /**
         * Can only escape one character (according to docs on the csv-parse module)
         * Escape quotation marks -- this is the default and so no need fo the escape clause
         * Seems to be fine with commas and  spostrophes within  the data fields
         */
        csvParser(csvData, {
          delimiter: ',',
          // escape: "'"
          //columns: true
          }, function(err, data) {
            if (err) {
                console.log(err);
                // process the error differently if this module is called from the sweep or
                // from the manual (screen) processing.  if sweep, might not have the sess object defined
                callback(err, null);
            } else {
                
                var numRows = data.length
                var rowsToInsert = data.length-1
                console.log('length of file is '+data.length);
                /**
                 * Format the date.  Timestamp for the db and then late needs to be converted to display
                 * format whenever needed for screen display.
                 * Was previously using CURRENT_TIMESTAMP in the INFILE SQL statement but this produces a long
                 * spelled out date and time
                 */
              
                /**
                 * csv-parser reads through the csv file and moves the contents to an array
                 * that is addessable in the normal manner
                 */
                 

                var _d = new Date();
                var _t = _d.getTime(); 
                var _updateTime = _t;
                var firstName = "";
                var lastName = "";
                var badgeNumber = 0;
                var title = "";
                var empID = "";
                var image ="";

                for (var i=1; i < data.length; i++) {

                  
                   
                    console.log ("The csv parse " +JSON.stringify(data[i][5]))
                    firstName = data[i][4];
                    lastName = data[i][3];
                    badgeNumber = 0;
                    title = "";
                    empID = data[i][1];
                    image = data[i][6];

                    /**
                     * Isolate all the badge credential substrings (delimited by pipe |)
                     * from the main credential field.
                     * This will produce an arrray where each row is an individual badge
                     */
                    var credStr = data[i][5];
                  
                    var credArr = credStr.split("|");
                    console.log ("The pipe parse "+JSON.stringify(credArr))

                    
                     /**
                     * Isolate the cardnumber.  The cardnumber is repeated at the beginning of the 
                     * credentials badge string and the second instance is preceded by a ~ (tilde).
                     * For each row (as split by pipe aboce), split the row string on tilde to
                     * isolate cardnumberand card status.
                     */
                   
                    for (var j=0; j < credArr.length; j++) {

                        /**
                         * If there is a single array entry for the credential and it is blank,
                         * set the badgeNumber to 0 and Inactive
                         *
                         */
                        if (credArr[0] ==" " || credArr[0].length ==0){
                          var badgeNumber=0
                          var status = "Blank"
                        }else{
                          var cardStr = credArr[j];
                          var cardArr = cardStr.split("~");
                          console.log ("The tilde parse " + JSON.stringify(cardArr))
                          console.log ("card number isolation "+JSON.stringify(cardArr[1]))
                          console.log ("card status " + JSON.stringify(cardArr[3]))

                          if (cardArr[3] == "Expired") {
                            console.log ("Card Expired")
                          }
                          badgeNumber = cardArr[1];
                          status = cardArr[3];
                        }

                            var escapeName = connection.escape(data[i][3]);
                            var escapeFirstName = connection.escape(data[i][4]);
                            var invSQL = "INSERT into Invitees (InvitationListID, BadgeNumber, LastName, FirstName, EmailAddress, NotificationNumber, NumberFormat, UpdateTime) VALUES (LAST_INSERT_ID(),"+badgeNumber+", "+ escapeName+", "+ escapeFirstName+", '', 0,'',"+_updateTime+")";
                            console.log('the sql string for S2 insert '+ invSQL);
                            
                            console.log('the escape sql string '+ escapeName);

                            query = connection.query(invSQL, function(err, resultt) {

                              if (err) {
                                console.log('Error while performing S2 invitee insert : ' + err);
                                callback(err,null);
                              }else{

                              }
                            });
                       
                        
                       
                    }
                    
                  }
                callback(sess.error,null)
                    
                    
         }; //feb--end of else in csvParser
      }); //feb--end of csvParser 

    }); //feb--end of fs.readfile

}
});
}