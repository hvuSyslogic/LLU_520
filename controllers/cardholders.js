//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var db = require('../models/db');

// handler for processing csv file ingest submit request
exports.cardholdersHome = function(req, res) {
	sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

        db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          // email mobss support if there is a problem connecting to the database
          emailController.sendIncidentEmail('There is a database problem @ cardholders.cardholdersHome', function(err,reslt){
          if (err) {console.log('a problem occurred, attempting to email customer support')}
          });
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          var _sqlQ = "SELECT * FROM people";
          connection.query(_sqlQ, function(err, results) {
              //connection.release();
            if(err) { console.log('cardholder query bad'+err); callback(true); return; }
            
            //sess.time = results[0].maxTime;
            
            res.render('cardholders', { title: 'Command Center - Cardholders', username: req.session.username, results });
            });
        }
        });
        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};
