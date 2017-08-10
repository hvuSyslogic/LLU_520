
var mysql = require('mysql');
var datetime = require('./datetime');
var db = require('../models/db');

///////////////////////////////////
// Display badges list screen    //
///////////////////////////////////
module.exports.badgesHome = function(req, res) {
  sess=req.session;
  // initializes the success/error messages for the report generation
  // ..so that messages are removed after leaving and re-entering the attendance ascreen
  sess.rptSuccess=null;
  sess.rptError=null;

     // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

        //feb--connect to the database, performa query to get all rows from people and send that data to 
        //--to be rendered as a table in Jade
        //feb- we have user entry at this point and so setting up the credentials here
       //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;

              var _sqlQ = "SELECT * FROM empbadge";
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('Empbadge query error : '+err); connection.end(); callback(true); return; }
             
              connection.end()

              res.render('badges', { title: 'Command Center', results });
              });
            }
        });
    }
};


///////////////////////////////////
// Display aactive badges list   //
///////////////////////////////////
module.exports.badgesActive = function(req, res) {
  sess=req.session;
  // initializes the success/error messages for the report generation
  // ..so that messages are removed after leaving and re-entering the attendance ascreen
  sess.rptSuccess=null;
  sess.rptError=null;

     // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

        //feb--connect to the database, performa query to get all rows from people and send that data to 
        //--to be rendered as a table in Jade
        //feb- we have user entry at this point and so setting up the credentials here
       //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;

              var _sqlQ = 'SELECT * FROM empbadge where StatusID="1"';
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('Empbadge query error : '+err); connection.end(); callback(true); return; }
             
              connection.end()

              res.render('badgesActive', { title: 'Command Center', results });
              });
            }
        });
    }
};

///////////////////////////////////
// Display inactive badges list  //
///////////////////////////////////
module.exports.badgesInactive = function(req, res) {
  sess=req.session;
  // initializes the success/error messages for the report generation
  // ..so that messages are removed after leaving and re-entering the attendance ascreen
  sess.rptSuccess=null;
  sess.rptError=null;

     // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

        //feb--connect to the database, performa query to get all rows from people and send that data to 
        //--to be rendered as a table in Jade
        //feb- we have user entry at this point and so setting up the credentials here
       //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;

              var _sqlQ = 'SELECT * FROM empbadge where StatusID!="1"';
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('Empbadge query error : '+err); connection.end(); callback(true); return; }
             
              connection.end()

              res.render('badgesInactive', { title: 'Command Center', results });
              });
            }
        });
    }
};

///////////////////////////////////////////
// Retrieve a badge record for viewing   //
///////////////////////////////////////////

module.exports.badgesGetOne = function(req,res) {

var firstName = ""
var lastName = ""
 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          console.log('badge param '+req.params.badgeID);
          var strSQL = 'SELECT * FROM empbadge WHERE iClassNumber="'+req.params.badgeID+'"';
         
          var query = connection.query(strSQL, function(err, result) {

               if (err) {
                  console.log(err)
                  connection.end();
                  //sess.error = 'There was a problem updating the mobss database: '+err;
                  res.render('cardholders', { title: 'Command Center'});
                } else {

                    console.log('empbadge : '+JSON.stringify(result))
                    var strSQL = 'SELECT LastName, FirstName FROM people WHERE iClassNumber="'+req.params.badgeID+'"';
         
                    var query = connection.query(strSQL, function(err, result2) {

                         if (err) {
                            console.log(err)
                            
                          } else {

                            firstName = result2[0].FirstName
                            lastName = result2[0].LastName
                          }
                          connection.end();
                          res.render('badgeDetail', { title: 'Command Center', result : result, firstName, lastName});
                    });
                };
                });//feb--end of connection.query
        }
    });
};
}; //end of getOne handler

