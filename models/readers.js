var datetime = require('fs');
var mysql      = require('mysql');
var db = require('./db');



var buildPeopleQuery = (function() {

  var insertPeople = function(field1, field2) {
    
    //var nobby = 'lobby';
    //var stiles = 'desmond';
    var nobby = field1;
    var stiles = field2;
    var parmQuery = 'SELECT * from testtab';
    var fields = '(Name, occupation)';
    var values = '("'+nobby+'", "'+stiles+'")';
    var updates = 'Name="'+nobby+'", occupation="'+stiles+'"';
    var parmQuery2 = 'INSERT INTO peeps (Name, occupation) VALUES ("rooby", "tacintyre") ON DUPLICATE KEY UPDATE Name="rooby", occupation="tacintyre"';
    var parmQuery3 = 'INSERT INTO peeps '+fields+' VALUES ' +values+ ' ON DUPLICATE KEY UPDATE '+updates;
    console.log('parmQuery3= '+parmQuery3);
    return parmQuery3;
  };
  return {insertPeople : insertPeople};
})();//

module.exports.getGeneralReaders = function(callback){
    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
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

module.exports.getAttendanceReaders = function(callback){

  db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
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

