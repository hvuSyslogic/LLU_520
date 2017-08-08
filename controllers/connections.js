//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var writeReport = require('./writeReport');



///////////////////////////////////////
//*  Display connections list screen //
///////////////////////////////////////
module.exports.connectionsHome = function(req, res) {
	sess=req.session;
  // initializes the success/error messages for the report generation
  // ..so that messages are removed after leaving and re-entering the attendance ascreen
  sess.rptSuccess=null;
  sess.rptError=null;

     // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

       //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;

              var _sqlQ = "SELECT * FROM Connections";
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('Device query error : '+err); connection.end(); callback(true); return; }
             
              connection.end()

              res.render('connections', { title: 'Command Center', username: req.session.username, results });
              });
            }
        });
    }
};

