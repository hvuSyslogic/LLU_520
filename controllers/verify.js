//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var writeReport = require('./writeReport');




// handler for processing csv file ingest submit request
module.exports.verifyHome = function(req, res) {
	sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

      //get a connection using the common handler in models/db.js
     db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          var _sqlQ = "SELECT * FROM verifyrecords";
          connection.query(_sqlQ, function(err, results) {
            //connection.release();
            if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
          //console.log("Meta query results are "+ JSON.stringify(results));
          //console.log("Meta query results are "+ results[0].maxTime);
          //console.log("check out a field--scanDate : ", results[0].scanDate);

          connection.end();


          res.render('verifyRecords', { title: 'Command Center 5.0 - Cardscans', username: req.session.username, results });
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};




// Handler that gets the selected records  for a badge number when customer select 'edit'
//  in the table on the home verify records screen

module.exports.verifyGetOne = function(req,res) {

 sess=req.session;
 sess.cardholdername=null;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {
      
      //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          // Get the cardholders name from the people table for display
          console.log('badgeID param '+req.params.badgeID);
          var strSQL1 = 'SELECT LastName, FirstName FROM people WHERE iClassNumber='+req.params.badgeID;
          var query = connection.query(strSQL1, function(err, rest) {

                 if (err) {
                    console.log(err)
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('verifyRecords', { title: 'Command Center'});
                    
                  } else {
                    if (rest.length >0 ) {
                    sess.cardholdername = rest[0].LastName+', '+rest[0].FirstName;
                    }else{
                    sess.cardholdername = 'Name not found'
                    }

                  }
                });//feb--end of connection.query

          var strSQL = 'SELECT * FROM verifyrecords WHERE BadgeID='+req.params.badgeID;
          console.log('here is the query string for verifyGetOne' + strSQL);
          //console.log('strSQL= '+ strSQL);  
          var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    res.render('verifyRecords', { title: 'Command Center'});
                  } else {
                    
                    console.log('full set of results are: ' + JSON.stringify(result));
                    var badgeNum = req.params.badgeID;
                    
                    res.render('verifyCheck', { title: 'Command Center', results : result, badgeNum : badgeNum, cardholderName : sess.cardholdername});
                  }
                });//feb--end of connection.query
        }
      });
    }
}; //feb--end of post handler


module.exports.contractorGetOne = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {
      console.log('am i making it this far CONTRACTORGETONE??');
      console.log('am i making it this far???' + req.query);
      console.log('am i making it this far???' + req.params);
      console.log('and the paramter is ' + JSON.stringify(req.body.EventID));
      //get a connection using the common handler in models/db.js
     db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var strSQL = 'SELECT * FROM verifyrecords WHERE contractor='+"'"+req.params.contractor+"'";
          console.log('here is the query string for contractorGetOne  ' + strSQL);
          //console.log('strSQL= '+ strSQL);  
          var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    res.render('verifyRecords', { title: 'Command Center'});
                  } else {
                    
                    console.log('full set of results are: ' + JSON.stringify(result));
                    var contractor = req.params.contractor;
                    
                    res.render('contractorCheck', { title: 'Command Center - Contractors', results : result, contractor : contractor});
                  }
                });//feb--end of connection.query
        }
      });
    };
}; //feb--end of post handler



// Within the verifyRecords detail screen (verifyCheck), handles the date range search
exports.verifySearch = function(req, res) {
  sess=req.session;
    var name = req.query.name;

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          // first get the search variables from the screen entries
          // is start is later than end, if so, just swap and them around and return the range anyway
          // format with the h/m/s variables to match the verifyRecords scanDateTime variable format
           
          var dayStart = ' 00:00:00';
          var dayEnd =  ' 23:59:59';
          if (req.body.startDate > req.body.endDate) {
                var searchStartDate = "'"+req.body.endDate+dayStart+"'";
                var searchEndDate =  "'"+req.body.startDate+dayEnd+"'";
              }else{
                var searchStartDate = "'"+req.body.startDate+dayStart+"'";
                var searchEndDate =  "'"+req.body.endDate+dayEnd+"'";
              }

              

          // set the form display dates (same as the format of the request)
          var displaySearchStart = req.body.startDate;
          var displaySearchEnd = req.body.endDate;

          var strSQL =  'select * from verifyrecords where BadgeID='+req.params.badgeID+' and ScanDateTime between '+searchStartDate+' and '+searchEndDate;
          console.log('full query'+ strSQL);
          var query = connection.query(strSQL, function(err, result) {

             if (err) {
                console.log(err)
                res.render('verifyCheck', { title: 'Command Center'});
              } else {
                console.log('full set of results are: ' + JSON.stringify(result));
                //for (var i=1; i < result.length; i++) {
                console.log('display start date is : ' + displaySearchStart);
                
                var badgeNum = req.params.badgeID;
                connection.end();
              

                res.render('verifyCheck', { title: 'Command Center', results : result, badgeNum : badgeNum, cardholderName : sess.cardholdername, displaySearchStart : displaySearchStart, displaySearchEnd : displaySearchEnd});
              }
            });//feb--end of connection.query
        }
    });
};


// handler displaying the attendance records for a particular event
module.exports.writeCardscansRpt = function(req, res) {
  console.error('im in the write handler: '+ JSON.stringify(req.body));
  sess=req.session;
  var badgeID = req.params.badgeID;

  writeReport.writeReport('Cardscans', badgeID, function(err,reslt){  
          res.status(301).redirect('/verifyCheck/'+badgeID);

    });
 
};
