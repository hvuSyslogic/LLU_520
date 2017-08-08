var datetime = require('fs');
var mysql = require('mysql');
var db = require('./db');


//////////////////////////////////////////////////////////
// Gets the list of devices from the DeviceHeader table //
//////////////////////////////////////////////////////////

module.exports.getBadDevices = function(callback){
    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var strSQL =  'SELECT * FROM DeviceHeader WHERE CurrentStatus="0" or CurrentStatus="2" or CurrentStatus="3";'
          connection.query(strSQL, function(err, rows, fields) {
             if (!err) {
              //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
               
              //Extract the devices that require activation so they can be listed separately
              //Create an array for devices requesting activation and bad devices 
                var BadArr = rows;
                var ActivateDevices = []
                var BadDevices = []

                for (var i = BadArr.length - 1; i >= 0; i--) {
                  if (BadArr[i].CurrentStatus == "0"){ActivateDevices.push(BadArr[i])}
                  else { BadDevices.push(BadArr[i])}  
                }
                connection.end();
                callback(null, BadDevices, ActivateDevices);

              }else{

                connection.end();
                callback(err, rows, null);
            }
        });
     }   
   });
};

/////////////////////////////////////////////////////////////////
// Gets the list of bad connections from the Connections table //
////////////////////////////////////////////////////////////////

module.exports.getBadConnections = function(callback){
    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,resltBC){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback from db common module
          var connection = resltBC;

          //var strSQL =  'SELECT * FROM Connections WHERE Result="2" or Result="3";'
          var strSQL = 'select * from connections WHERE Result="2" or Result="3" ORDER BY connections.ConnectionAttemptTime DESC;'
          connection.query(strSQL, function(err, rows, fields) {
             if (!err) {
              //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
               
                connection.end();
                callback(null, rows);

              }else{

                connection.end();
                callback(err, rows);
            }
        });
     }   
   });
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Following code is note currently used.  was used to extract list of active readers before the device management functionality //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports.getGeneralReaders = function(callback){
    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          var strSQL =  'SELECT * FROM (SELECT * FROM verifyrecords ORDER BY scanDateTime DESC) tmp GROUP BY clientSWID;'
          connection.query(strSQL, function(err, rows, fields) {
             if (!err) {
              //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
               
                console.log('results of join'+JSON.stringify(rows));
                connection.end();
                callback(null, rows);

              }else{
                console.log('error with the max query');
                connection.end();
                callback(err, rows);
            }
        });
     }   
   });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Following code is note currently used.  was used to extract list of active readers before the device management functionality //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getAttendanceReaders = function(callback){

  db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);
          var strSQL =  'SELECT * FROM (SELECT * FROM attendance ORDER BY AttendDate DESC) tmp GROUP BY ReaderID;'
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                  console.log('results of attend join'+JSON.stringify(rows));
                  connection.end();
                  callback(null, rows);

                }else{
                  console.log('error with the attend reader query');
                  connection.end();
                  callback(err, rows);
                  }
                });
        }
  });
        
};

