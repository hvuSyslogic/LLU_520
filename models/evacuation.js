var datetime = require('fs');
var mysql    = require('mysql');
var db = require('./db');



module.exports.createEvacuationList = function(field1, field2, field3, field4, field5, field6, callback){

  
  db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          var buildEvacuationQuery = (function() {
            var createEvacuationList = function(field1, field2, field3, field4, field5,field6) {

              var _FirstName = field1;
              var _LastName = field2;
              var _iClassNumber = field3;
              var _updateTime = new Date();
              var _empID = field4;
              var _Status = null;
              var _UserName = null;
              var _image = field6;
              var _title = field5;
              var _imageName = field6;
              var _hasImage = "Yes";
              var _qFields = '(FirstName, LastName, iClassNumber, updateTime, empID, Status, UserName, image, title, imageName, hasImage)';
              var _qValues = '("'+_FirstName+'", "'+_LastName+'", "'+_iClassNumber+'", "'+_updateTime+'", "'+_empID+'", "'+_Status+'", "'+_UserName+'", "'+_image+'", "'+_title+'", "'+_imageName+'", "'+_hasImage+'")';                                                      
              var _qUpdates = 'FirstName="'+_FirstName+'", LastName="'+_LastName+'"'+', iClassNumber="'+_iClassNumber+'"'+', updateTime="'+_updateTime+'"'+', empID="'+_empID+'"'+', Status="'+_Status+'"'+', UserName="'+_UserName+'"'+', image="'+_image+'"'+', title="'+_title+'"'+', imageName="'+_imageName+'"'+', hasImage="'+_hasImage+'"';
              var parmQuery2 = 'INSERT INTO peeps (Name, occupation) VALUES ("rooby", "tacintyre") ON DUPLICATE KEY UPDATE Name="rooby", occupation="tacintyre"';
              var parmQuery3 = 'INSERT INTO evacuation '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
              //console.log('parmQuery3= '+parmQuery3);
              return parmQuery3;
            };
            return {createEvacuationList : createEvacuationList};
          })();//feb--end of revealing module

          var strSQL = buildEvacuationQuery.createEvacuationList(field1, field2, field3, field4, field5, field6);
     
              var query = connection.query(strSQL, function(err, result) {

               if (err) {
                  console.log(err)
                  sess.error = 'There was a problem creating the evacuation list: '+err;
                  callback(err, result);
                } else {
                  
                  console.log('all ok creating the evacuation list');
                  callback(null, result);

                };
              });//feb--end of connection.query
        }
  });             

};


module.exports.getEvacuationList = function(callback){
  

  db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var strSQL = 'SELECT * FROM evacuation';
              //console.log('strSQL= '+ strSQL);  
          var query = connection.query(strSQL, function(err, result) {
             
              //if (err) throw error;
               if (err) {
                  console.log(err)
                  connection.end();
                  sess.error = 'There was a problem creating the evacuation list: '+err;
                  callback(err, result);
                } else {
                  connection.end();
                  console.log('all ok creating the evacuation list');
                  callback(null, result);

                }
              });
        }
  });
};