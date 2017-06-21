//////////////////////////////////////////////////////////////////////////////////////////////
//  Common handler for reading through a CSV file and inserting those records into the      //
//  evacuation table.                                                                       //
//  PROBABLY SHOULD CHANGE THIS TO INFILE PROCESSING                                        //
//////////////////////////////////////////////////////////////////////////////////////////////

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var readers = require('../models/readers');
var db = require('../models/db');
var csvProcess = require('./csvProcess');


exports.evacuationHome = function(req, res) {
  sess=req.session;
  var name = req.query.name;
  if (typeof sess.username == 'undefined'){
    res.render('home', { title: 'Command Center'});
    // if user is logged in already, take them straight to the dashboard list
    }else{

    res.render('evacuationHome', { title: 'Command Center'});
};
};



// handler for form submitted from homepage
exports.evacuationCSV = function(req, res) {
   
  
		
  if (req.body.directorySource == undefined) {
    var csvFileName = req.body.fileName;

  } else{
    var csvFileName = req.body.directorySource + req.body.fileName;
  }
  csvProcess.csvIngest(csvFileName, 'evacuation', function(err, result){ 
      if (err) {
        console.log('Error while performing evacuation: ' + err);
        sess.error = 'Error while performing evacuation list creation';
        sess.success = null;
        res.render('evacuationHome', { title: 'Command Center'});

      } else {
        console.log('successful ingestion CSV to evacuation: ' + err);
        sess.error = null;
        sess.success = 'successfully created evacuation list';
        res.render('evacuationHome', { title: 'Command Center'});
      }
    });

};

