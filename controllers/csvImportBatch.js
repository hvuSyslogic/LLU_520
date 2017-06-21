
/////////////////////////////////////////////////////////
//  Handler for importing invite lists in batch format //
/////////////////////////////////////////////////////////

var mysql    = require('mysql');
var fs  = require('fs');
var clearTables = require('../models/clearTables');
var db = require('../models/db');
var inviteList = require('../models/inviteList');

exports.inFileInvite = function(connection, csvFileName, listName, listComment, host, callback) {
  //sess.success = null;
 // sess.error = null;
  var strSQL = "";
  var query = null;

  
        
         // Not sure if we need to clear any invitee records before import
         // Presumably, we need to create a header record and then import the 
         // records in the headers associated invitees file

          //  Use MySQL INFILE function
          //to directly load people, empbadge and accesslevels tables from the csv file
          //this is considered up to 20 times faster than INSERT
          //file to table mapping can be controlled the @variables (see @dummy below)
                     
          // Create the InviteList first, and then if successful, 
          // INFILE the csv into the invitees table
          // 
  /**
   * set the case for the wether the MYSQL db is local or remote from the app .env file.
   * if remote, use LOAD LOCAL for the INFILE, as RDS (and perhaps other remote instances)
   * can't be configured to use regular INFILE.  Dong this largely because RDS is 
   * not set up to allow regular INFILE but DOES allow LOAD LOCAL, and at least one customer
   * has a localhost MySQL which does not allow LOCAL.
   * So we will configure the front part of the INFILE SQL statement based on our .env variable.
   */
  

    var dbLoc = host;
    var strPrepend = "";

    switch (dbLoc)
    {
       case "localhost":
          strPrepend = 'LOAD DATA INFILE '
          break;

      default: 
        strPrepend = 'LOAD DATA LOCAL INFILE '
    }

    //  First create the invite list
    inviteList.createInviteList(connection, listName, listComment, function(err,rslt){
      if (err) {
        console.log('Error while performing people table clear: ' + err);
        //sess.error = 'There was a problem creating the InviteList the table';
        connection.end();
        callback(err, null);
      }else{

                        /**
                         * Ensure the filename is in forward slash formats. 
                         * return the full path from the form input file-type AND with back slashes
                         * Browsers  will only return the filename and not the path.   this is a 
                         * security policy by the major browsers.   There doesnt seem to be a way
                         * for the user to select a path/filename and have the path come back from 
                         * the browser.  The actual path is not returned by the browser
                         */
                        console.log('invite filename BEFORE replace'+csvFileName);
                        csvFileName = csvFileName.replace(/\\/g, "/");
                        console.log('invite filename AFTER replace'+csvFileName);
                        /////////////////////////////////////////////////////////////////////////////
                        //  This format is for a simple csv that comports with the table structure //
                        /////////////////////////////////////////////////////////////////////////////
                        // strSQL = "LOAD DATA LOCAL INFILE "+ "'"+csvFileName+"'"+" INTO TABLE Invitees FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (BadgeNumber, LastName, FirstName,  EmailAddress, NotificationNumber, NumberFormat) SET  UpdateTime = CURRENT_TIMESTAMP, InvitationListID = LAST_INSERT_ID()";

                        ///////////////////////////////////////////////////////////////////////////////////////////////
                        //  Whereas this format is for the beta customer who sent csv files in the cardholder format //
                        ///////////////////////////////////////////////////////////////////////////////////////////////
                        strSQL = strPrepend+ "'"+csvFileName+"'"+" INTO TABLE Invitees FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (@dummy, LastName, FirstName, @dummy, BadgeNumber) SET  UpdateTime = CURRENT_TIMESTAMP, InvitationListID = LAST_INSERT_ID()";
                        console.log('here is the infile query '+strSQL);
                        console.log('HERE IS THE CSVFILENAME '+csvFileName);
                        query = connection.query(strSQL, function(err, result) {

                      
                         if (err) {
                            console.log(err)
                           // sess.error = 'There was a problem importing csv file to the people table';
                            callback(err, 'failed');
                            connection.end();
                            
                          } else {
                           // sess.success ='Update was successful.';
                            //console.log('sess.success= '+sess.success);
                            callback(null, 'success');
                            connection.end();
                          }

                        });
            }
          });



        
    };
