
////////////////////////////////////////
// Common module for people table I/O //
////////////////////////////////////////
var datetime = require('fs');
var mysql    = require('mysql');
var db = require('./db');


////////////////////////////////////////////////////////////
//  Handler for inserting a record to the people database //
////////////////////////////////////////////////////////////
module.exports.createPeopleRecord = function(connectionP, firstName, lastName, iClassNumber, title, empID, image, callback) 
{

  console.log('CREATEPEOPLE HANDLER')
 
  var buildPeopleQuery = (function() {
        var insertPeople = function(field1, field2, field3, field4, field5,field6) {
          /**
           * Escape the name and title fields first
           * This will allow apostrophes tp be inserted
           */
          var _FirstName = connectionP.escape(field1);
          var _LastName = connectionP.escape(field2);
          var _iClassNumber = field3;
          //var _updateTime = new Date();  // this one produces a very long string, too long for legacy installs
          var _d = new Date();
          var _t = _d.getTime(); 
          var _updateTime = _t;
          //var _updateTime = new Date(year, month, day, hours, minutes, seconds);
          // var _empID = field4;
          var _empID = field5;
          
          var _Status = null;
          var _UserName = null;
          var _image = "";
          var _title = connectionP.escape(field4);
          var _imageName = connectionP.escape(field6);
          var _hasImage = "Yes";
          var _qFields = '(FirstName, LastName, iClassNumber, updateTime, empID, Status, UserName, image, title, imageName, hasImage)';
          var _qValues = '('+_FirstName+', '+_LastName+', '+_iClassNumber+', "'+_updateTime+'", '+_empID+', '+_Status+', '+_UserName+', "'+_image+'", '+_title+', '+_imageName+', "'+_hasImage+'")';                                                      

          //var _qValues = '("'+_FirstName+'", "'+_LastName+'", "'+_iClassNumber+'", "'+_updateTime+'", "'+_empID+'", "'+_Status+'", "'+_UserName+'", "'+_image+'", "'+_title+'", "'+_imageName+'", "'+_hasImage+'")';                                                      
          //var _qUpdates = 'FirstName="'+_FirstName+'", LastName="'+_LastName+'"'+', iClassNumber="'+_iClassNumber+'"'+', updateTime="'+_updateTime+'"'+', empID="'+_empID+'"'+', Status="'+_Status+'"'+', UserName="'+_UserName+'"'+', image="'+_image+'"'+', title="'+_title+'"'+', imageName="'+_imageName+'"'+', hasImage="'+_hasImage+'"';
          var _qUpdates = 'FirstName='+_FirstName+', LastName='+_LastName+', iClassNumber='+_iClassNumber+', updateTime="'+_updateTime+'", empID='+_empID+', Status='+_Status+', UserName='+_UserName+', image="'+_image+'", title='+_title+', imageName='+_imageName+', hasImage="'+_hasImage+'"';

          var parmQuery2 = 'INSERT INTO peeps (Name, occupation) VALUES ("rooby", "tacintyre") ON DUPLICATE KEY UPDATE Name="rooby", occupation="tacintyre"';
         // var parmQuery3 = 'INSERT INTO people '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
          var parmQuery3 = 'INSERT INTO people '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
          
          return parmQuery3;
      };
      return {insertPeople : insertPeople};
    })();//feb--end of revealing module

      var strSQL = buildPeopleQuery.insertPeople(firstName, lastName, iClassNumber, title, empID, image);
                console.log('strSQL= '+ strSQL);  
                var query = connectionP.query(strSQL, function(err, result) {

                 if (err) {
        
             
                    console.log('problem with the insert people query '+err);
                    
                    connectionP.destroy();
                    
                  } 
                  callback(err, null);
                  
      });//feb--end of connection.query for insert people record
  
}; //feb--end of post handler



exports.getPeopleName = function(empID, callback){

  db.createConnection(function(err,reslt){  
        if (err) {
          
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);
          var strSQL =  'SELECT FirstName, LastName FROM people where EmpID = '+empID;
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                  console.log('results of attend join'+JSON.stringify(rows));
                  connection.end();
                  callback(null, rows);

                }else{
                  console.log('error with the people query');
                  connection.end();
                  callback(err, rows);
                  }
                });
        }
  });
        
};

