var mysql  = require('mysql');


//feb--handler for inserting the accesslevel information to the database
exports.clearAllFromTable = function(connection, table, callback) {


  var clearTableQuery = connection.query("Delete from "+table, function(err, result) {
                     
       if (err) {
          console.log(err)
          sess.error = 'There was a problem deleting the records of the '+table+' table in preparation for a new file import';
          callback(err, null);
        } else {
          console.log('all ok with the '+table+' table clear');
          console.log('delete result..'+JSON.stringify(result));
          callback(null, result);
        }
  });                          
                          
}; //feb--end of function

