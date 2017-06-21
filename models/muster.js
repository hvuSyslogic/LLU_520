var datetime = require('fs');
var mysql      = require('mysql');
var db = require('./db');



module.exports.getMusterRecords = function(id, zone, callback){

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var strSQL =  'SELECT * FROM muster where musterID='+id+' and zone='+zone;
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                  //var array=[];
                  //rows.forEach(function(item) {
                     // array.push(item.clientSWID);
                   // });
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



