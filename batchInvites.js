
/////////////////////////////////////////////////////////
//  Handler for importing invite lists in batch format //
/////////////////////////////////////////////////////////

var csvImportBatch = require('./controllers/csvImportBatch');
var db = require('./models/db');
var mysql = require('mysql');
var fs  = require('fs');


var connection = mysql.createConnection({
  
  //user     : sess.username,
  //password : sess.password,
 
  host     : process.argv[9],
  user     : process.argv[11],
  password : process.argv[13],
  database : process.argv[15]
});
  console.log('does this dotenv stuff work '+process.env.DB_PASS);
  connection.connect(function(err) {
  if (err) {
    console.error('error doing the modularized connect ' + err.stack);
    
  } else {
  /**
   * Calling the batch handler to process the import using INFILE
   * [3] [filename]
   * [5] [list name]
   * [7] [list comment]
   * [9] [host so that can condition the INFILE to be LOAD LOCAL or regular]                           
   */
	csvImportBatch.inFileInvite(connection, process.argv[3], process.argv[5], process.argv[7], process.argv[9], function(err, res2){ 
                    if (err) {
                      console.log('Error while performing BATCH INFILE proessing: ' + err);
                      
                    } else {
                      console.log('Invite List '+process.argv[3]+' succesfully created from '+process.argv[2]);
                    }
            });
    
};
});

