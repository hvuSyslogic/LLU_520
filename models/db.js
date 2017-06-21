var mysql      = require('mysql');
var emailController = require('../controllers/emailController');


//Make the connection set up reusable from everywhere and also make it
// dependant on the .env environment variables
module.exports.createConnection = function(callback){
var connection = mysql.createConnection({
  
  //user     : sess.username,
  //password : sess.password,
 
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});
  console.log('does this dotenv stuff work '+process.env.DB_PASS);
  connection.connect(function(err) {
  if (err) {
    console.error('error doing the modularized connect ' + err.stack);
    // email mobss support if there is a problem connecting to the database
    emailController.sendIncidentEmail('There is a database problem @ db.createConnection', function(err,reslt){
        if (err) {console.log('a problem occurred, attempting to email customer support')}
        });
    callback('error connecting to database in db.js', null);
  } else {
    callback(null, connection);
};
});
};


//*
//*
//*This is just a test handler right now
//*
//*
module.exports.getQuery = function(callback){

    var connection = mysql.createConnection({
   		host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME
 	});

 	var parmQuery = 'SELECT * from testtab';

    connection.query(parmQuery, function(err, rows, fields) {
   		 if (!err) {
    		//feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
       		callback(null, rows);
    	 } else {
       		console.log('Error while performing Query in getQuery.');
          emailController.sendIncidentEmail('There is a database problem @ db.getquery', function(err,reslt){
                if (err) {console.log('a problem occurred, attempting to email customer support')}
              });
       		callback(err, rows);
    	 }; 
    });
};


//*
//*
//*Gets the most recent timestamp from the table, ie, the most recently posted record
//*
//*
module.exports.getTableLatestUpdateTime = function(table, callback){

    var connection = mysql.createConnection({
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME
  });

  var strSQL =  "SELECT MAX(updateTime) AS 'maxTime' FROM "+table
  connection.query(strSQL, function(err, rows, fields) {
       if (!err) {
        //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
        
          console.log('results of join'+JSON.stringify(rows));
          connection.end();
          callback(null, rows);


          }else{
              console.log('error with the max query');
              //send an email to mobss technical support detailing error
              emailController.sendIncidentEmail('There is a database problem @ db.getlatestupdatetime', function(err,reslt){
                if (err) {console.log('a problem occurred, attempting to email customer support')}
              });
              connection.end();
              callback(err, rows);
            }
        });
        
};


//*
//*
//*Gets the number of records in the table
//*
//*
module.exports.getTableRowCount = function(table, callback){

    var connection = mysql.createConnection({
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME
  });

  var strSQL =  "SELECT COUNT(*) AS 'rowCount' FROM "+table
  connection.query(strSQL, function(err, rows, fields) {
       if (!err) {
        //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
          connection.end();  
          callback(null, rows);

          }else{
              console.log('error with the count query');
              //send an email to mobss technical support detailing error
              emailController.sendIncidentEmail('There is a database problem @ db.gettablerowcount', function(err,reslt){
                if (err) {console.log('a problem occurred, attempting to email customer support')}
              });
              connection.end();
              callback(err, rows);
            }
        });
        
};

module.exports.getNextEvent = function(callback){

    var connection = mysql.createConnection({
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME
  });

  var strSQL =  "SELECT * FROM events where EventDateTime > CURDATE()"
  connection.query(strSQL, function(err, rows, fields) {
       if (!err) {
        //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
          connection.end();  
          var returnValue = "None";
          if (rows.length >0){returnValue = rows[0].EventDateTime }
          callback(null, returnValue);

          }else{
              console.log('error with the count query');
              //send an email to mobss technical support detailing error
              emailController.sendIncidentEmail('There is a database problem @ db.gettablerowcount', function(err,reslt){
                if (err) {console.log('a problem occurred, attempting to email customer support')}
              });
              connection.end();
              callback(err, returnValue);
            }
        });
        
};

