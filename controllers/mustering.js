//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var muster = require('../models/muster');
var evacuation = require('../models/evacuation');
var db = require('../models/db');



// handler for processing csv file ingest submit request
module.exports.musterHome = function(req, res) {
	sess=req.session;
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
            console.log('here is the connnection '+reslt.threadId);


            var _sqlQ = "SELECT * FROM musterMaster";
            connection.query(_sqlQ, function(err, results) {
              //connection.release();
              if(err) { console.log('event query bad'+err); callback(true); return; }


              res.render('musterHome', { title: 'Command Center - Muster Master', username: req.session.username, results });
            });
          }
      });
        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};




// Handler that gets the selected records  for a badge number when customer select 'edit'
//  in the table on the home verify records screen

module.exports.musterGetOne = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {
      console.log('am i making it this far MUSTERGETONE??');
      console.log('am i making it this far???' + req.query);
      console.log('am i making it this far???' + req.params);
      console.log('and the paramter is ' + JSON.stringify(req.params.musterID));
      //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          console.log('musterID param '+req.params.musterID);
          

          var strSQL = 'SELECT * FROM muster WHERE musterID='+req.params.musterID;
          console.log('here is the query string for musterGetOne' + strSQL);
          //console.log('strSQL= '+ strSQL);  
          var query = connection.query(strSQL, function(err, result) {

          if (err) {
              console.log(err)
              //sess.error = 'There was a problem updating the mobss database: '+err;
              res.render('musterDetail', { title: 'Command Center'});
            } else {
              
              console.log('full set of muster results are: ' + JSON.stringify(result));
              var musterID=req.params.musterID;
              var musterName=null;
              if(result.length>0){
                musterID = result[0].musterID;
                musterName = result[0].musterName;
              }
              
              res.render('musterDetail', { title: 'Command Center - Muster Detail', results : result, musterID : musterID, musterName : musterName});
            }
          });//feb--end of connection.query
        }
      });    
    };
}; //feb--end of post handler




    // handler for showing simple pages
exports.musterAdd = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

    var name = req.query.name;
    
    res.render('musterAdd', { title: 'Command Center - Add Muster Event'});
 };
};


//feb--handler for posting a new muster to the database
exports.musterPostDatabase = function(req,res) {

console.log('am i making it this far for MUsTEr POST???');


  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var buildMusterMasterQuery = (function() {
                    var insertMuster = function(field1, field2, field3, field4, field5,field6,field7) {
    
                      //var _musterID = field1;
                      var _musterName = field1;
                      var _Location = field2;
                      var _dateTime = field3;
                      var _musterCaptain = field4;
                      var _Status= field5;
                      var _Type= field6;
                      var _Zones=field7;

                      //var _comments = field6;
                      //var _updateTime = new Date();
                      //var _eventsType = field7;
                      //console.log('here is updateTIme  '+_updateTime);
                      
                      var _qFields = '(musterName, Location, dateTime, musterCaptain, Status, Type, Zones)';
                      var _qValues = '("'+_musterName+'", "'+_Location+'", "'+_dateTime+'", "'+_musterCaptain+'", "'+_Status+'", "'+_Type+'", "'+_Zones+'")';                                                      
                      var _qUpdates = 'musterName="'+_musterName+'", Location="'+_Location+'"'+', dateTime="'+_dateTime+'"'+', musterCaptain="'+_musterCaptain+'"'+', Status="'+_Status+'"'+', Type="'+_Type+'"'+', Zones="'+_Zones+'"';
                      var parmQuery3 = 'INSERT INTO musterMaster '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                      //console.log('parmQuery3= '+parmQuery3);
                      return parmQuery3;
               };
               return {insertMuster : insertMuster};
              })();//feb--end of revealing module

              var strSQL = buildMusterMasterQuery.insertMuster(req.body.musterName, req.body.Location, req.body.eventDate, req.body.musterCaptain, req.body.Status, req.body.Type, req.body.Zones);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {

                              // INSERT INTO Users (id, weight, desiredWeight) VALUES(1, 160, 145) ON DUPLICATE KEY UPDATE weight=160, desiredWeight=145
               // Neat!
                            //if (err) throw error;
                             if (err) {
                                console.log(err)
                                sess.error = 'There was a problem posting the mobss database: '+err;
                                connection.end();
                                res.render('eventAdd', { title: 'Command Center 360'});
                              } else {
                                //console.log(err);
                                connection.end();
                                res.redirect('/musterHome');
                            };
                            });//feb--end of connection.query
        }
    });
}; //feb--end of post handler


//feb--changes to following handlers to incorporate new express 4 session handling, as above
// handler for displaying the dashboard
exports.musterLive= function(req, res) {
  sess = req.session;
  sess.time = '';
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
    
    muster.getMusterRecords(req.params.musterID, '1', function(err, resz1){ // begin of gets
    if (err) {
      console.log('Error while performing query: ' + err);
    }
    else {

      muster.getMusterRecords(req.params.musterID, '2', function(err, resz2){ 
      if (err) {
        console.log('Error while performing query: ' + err);
      }
      else {
      
        muster.getMusterRecords(req.params.musterID,'3', function(err, resz3){ 
          if (err) {
        console.log('Error while performing query: ' + err);
         }
         else {
            evacuation.getEvacuationList(function(err, resEvacs){ 
             if (err) {
              console.log('Error while performing get evac records: ' + err);
              }
              else {

              // loop through the evac array and remove entry if badgeId record exists in the muster array 
              console.log('whats the array length  ' + JSON.stringify(resEvacs.length));
              //console.log('whats the array value  ' + JSON.stringify(resEvacs[0].iClassNumber));
              var origEvacLength = resEvacs.length;
              

              for (var i=0; i < resEvacs.length; i++) {
                
                console.log('whats the array value  ' + JSON.stringify(resEvacs[i].iClassNumber)); 
                console.log('whats the muster array length  ' + JSON.stringify(resz3.length)); 
                
                for (var j=0; j < resz3.length; j++) {
                    var intOfString = parseInt(resz3[j].BadgeID); 
                    console.log('the two values '+ intOfString + ' '+resEvacs[i].iClassNumber);
                    if (intOfString==resEvacs[i].iClassNumber) {
                      console.log('ever getting here?? ') 
                      resEvacs.splice(i,1);
                      
                }
                
            }
          }
      
          // to assist making the progress bars variable, carry both a number and the number+% in array

          var progress = [{
              statusPicture1:'status_Red.png',
              progress1 : '16%'
              },
              {statusPicture2:'status_Orange.png',
              progress2 : '66%'
              },
              {statusPicture3:'status_Red.png',
              progress3 : '6%'
              },
              {statusPicture4:'status_Green.png',
              progress4 : '100%'
              },
              {statusPicture5:'status_Red.png',
              progress5 : '36%'
              },
              {statusPicture6:'status_Orange.png',
              progress6 : '76%'
              }];

          console.log('AGAIN');
          var missingCount = resEvacs.length;
          var overallProg = (origEvacLength - missingCount) / origEvacLength * 100;
          console.log('overall progress is '+overallProg)
          var overallProgRound = overallProg.toFixed(0);
          var overallProgress = overallProg.toFixed(0)+'%';
          statusBar="danger";


          res.render('musterLive', { title: 'Command Center - Live Muster', statusBar : statusBar, overallProgress : overallProgress, overallProgRound : overallProgRound, missingCount : missingCount, resEvacs : resEvacs, progress : progress, username: req.session.username, resz1 : resz1, resz2 : resz2, resz3 : resz3});
        }
      });
        } // if else last get muster
      });
      } // if else second get muster
    });
    } // if else third get muster
  });
      }
     
    }; //end of handler

