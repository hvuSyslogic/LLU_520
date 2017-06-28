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

var csvFileName = process.argv[3]

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
                    
                      /**
                       * csv-parser reads through the csv file and moves the contents to an array
                       * that is addessable in the normal manner
                       */
                       

                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      
                      for (var i=1; i < data.length; i++) {

                        
                          /**
                           * Isolate the cardnumber.  The cardnumber is repeated at the beginning of the 
                           * credentials string and the second instance is preceded by a ~ (tilda).
                           * Split the string on tilda to isolate cardnumber, card status and multiple cards.
                           */
                          console.log ("The csv parse " +JSON.stringify(data[i][5]))

                          var credStr = data[i][5];
                          var credArr = credStr.split("|");
                          console.log ("The pipe parse "+JSON.stringify(credArr))

                          /**
                           * For each badge credential substring (delimited by pipe |),
                           * isolate the badge number and status
                           */
                          for (var i=0; i < credArr.length; i++) {

                              var cardStr = credArr[i];
                              var cardArr = cardStr.split("~");
                              console.log ("The tilde parse " + JSON.stringify(cardArr))
                              //var cardNumber = arr[]
                              console.log ("card number isolation "+JSON.stringify(cardArr[1]))
                              console.log ("card status " + JSON.stringify(cardArr[3]))

                              if (cardArr[3] == "Expired") {
                                console.log ("Card Expired")
                              }
                          }




                          
                        }


                          
               }; //feb--end of else in csvParser
            }); //feb--end of csvParser 

          }); //feb--end of fs.readfile
    