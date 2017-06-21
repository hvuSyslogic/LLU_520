///////////////////////////////////////////////////////////////////////////////////////////////
//  This is the main controller, handling the home, login/logout, About and Dashboard routes //
///////////////////////////////////////////////////////////////////////////////////////////////
var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var readers = require('../models/readers');
var db = require('../models/db');
var user = require('../models/user');
var emailController = require('./emailController');




exports.home = function(req, res){
 	// feb--initiatie the session and chekc the Id in the console
	sess = req.session;
	sess.error = null;
  
	
	res.render('setup', { title: 'Command Center - Setup Page'});
   
    
}; // feb--end of exports home



// handler for form submitted from homepage
exports.saveSetup = function(req, res) {
    
	
}; 

//feb--changes to following handlers to incorporate new express 4 session handling, as above
// handler for displaying the dashboard
exports.dashboardHome = function(req, res) {
	sess = req.session;
  sess.time = '';
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') {
			res.redirect('/');
    }else{
		//feb--get all records form the people table
		var myPool = require('../models/db').pool;
		//myPool.getConnection(function(err, connection) {
    	//if(err) { console.log('didnt get from the pool'+ err); callback(true); return; }
    readers.getGeneralReaders(function(err, result){ // begin of gets
    if (err) {
      console.log('Error while performing query: ' + err);
      //send an email to mobss technical support detailing error
      emailController.sendIncidentEmail('There is a database problem @ [dashgGR]', function(err,reslt){
        if (err) {console.log('a problem occurred, attempting to email customer support')}
      });
      //Return to the home screen.  reset the log in entries in order not to trigger a loop through
      // dashboard initiation again
      sess.authenticated = false;
      sess.error = 'There is a database problem, please contact support [dashgGR]';
      sess.username = null;
      sess.password = null;
      res.render('home', { title: 'Command Center 5.0'});
    }
    else {

      
      db.getTableLatestUpdateTime('people', function(err,reslt){  //LINE AFTEr INSERT
        if (err) {
          console.log('Error while performing roow count query: ' + err);
        }else{

          /**
           * Timestamps are being stored as VARCHAR in the mobss db right now.
           * Convert timestamp to a number so that the new Date function can convert
           * it to a date for display
           */
          var parm = reslt[0].maxTime;
          var parmAsInt = Number(parm)
          var metaTime = new Date(parmAsInt);

          db.getTableRowCount('people', function(err,rslt){
          if (err) {
            console.log('Error while performing roow count query: ' + err);
          }else{
            var rowCount = rslt[0].rowCount;
            console.log('row count is '+ rowCount);
            var envMUSTER = process.env.MUSTER;

                   db.getNextEvent( function(err,rst){
                      if (err) {
                        console.log('Error while performing next event query: ' + err);
                      }else{
                        var nextEvent = rst;
                        res.render('dashboard', { title: 'Command Center - Dashboard', username: req.session.username, results : result, metaTime : metaTime, rowCount : rowCount, envMUSTER : envMUSTER, rst : rst});
                      }
                    });  
          }
        });
        }
          
        });
 
    }     // END OF GETGENERAL ifELSE
    });   // END Of GETGENERAL

    //};  //feb -- end of if/else 
};
};




// handler for showing simple pages
exports.about = function(req, res) {
	sess=req.session;
  var name = req.query.name;

  if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
    var version = 'command center : '+process.env.VERSION;
    var clientname = 'client : '+process.env.CLIENTNAME;
    var computername = 'server : '+process.env.COMPUTERNAME;
    var userdomain = 'user domain : '+process.env.USERDOMAIN;
    var dblocation = 'database : '+process.env.DB_HOST;
     
   

    res.render('about', { title: 'Command Center - About' + name, username: sess.username, clientname: clientname, computername : computername, userdomain: userdomain, version : version, dblocation : dblocation });
    }
};




