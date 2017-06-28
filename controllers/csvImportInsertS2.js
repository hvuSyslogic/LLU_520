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

//var csvFileName = process.argv[3]

exports.processInsert = function(connection, connectionEB, connectionAL, csvFileName, callback) {

    fs.readFile(csvFileName, {
        encoding: 'utf-8'
      }, function(err, csvData) {
            if (err) {
            sess.error = 'File not found.  Please check directory and file name.';
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
                sess.error = 'csv file problem -- '+err;
                callback(err, null);
            } else {
                
                var numRows = data.length
                var rowsToInsert = data.length-1
                sess.error =null;
                sess.success=null;
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

                        people.createPeopleRecord(connection, firstName, lastName, badgeNumber, title, empID, image, function(err, res2){
                          if (err){
                            if (sess.error==null) {sess.error=err}
                            console.log("people table was not created properly "+badgeNumber)}

                        });
                        /**
                         * Create the empbadge table using a separate connection 
                         */
                        empBadge.createEmpBadge(connectionEB, badgeNumber, empID, status, function(err,resllt){
                          if (err){
                            if (sess.error==null) {sess.error=err}
                              console.log('EmpBadge was NOT created properly')}
                        });
                        /**
                         * Create the accesslevels table using a separate connection 
                         */
                        accessLevel.createAccessLevel(connectionAL, badgeNumber, empID, function(err,resllt){
                         if (err){
                            if (sess.error==null) {sess.error=err}
                              console.log('accesslevels was NOT created properly')}
                        });
                       
                    }
                    
                  }
                  callback(sess.error,null);


                    
         }; //feb--end of else in csvParser
      }); //feb--end of csvParser 

    }); //feb--end of fs.readfile
}