var datetime = require('fs');
var mysql      = require('mysql');


//feb--handler for inserting the accesslevel information to the database
exports.createAccessLevel = function(connectionAL, badgeID, empID, callback) {



var buildAccessLevelQuery = (function() {
                    var insertAccessLevel = function(field1, field2) {
    
                      var _BadgeID = field1;
                      var _AccsLvlID = 1;
                      var _AccsLvlName = 'Main';
                      var _EmpID = field2;
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      
                      
                      var _qFields = '(BadgeID, AccsLvlID, AccsLvlName, EmpID, updateTime)';
                      var _qValues = '('+_BadgeID+', '+_AccsLvlID+', "'+_AccsLvlName+'", '+_EmpID+', "'+_updateTime+'")';                                                      
                      var _qUpdates = 'BadgeID='+_BadgeID+', AccsLvlID='+_AccsLvlID+''+', AccsLvlName="'+_AccsLvlName+'"'+', EmpID='+_EmpID+', updateTime="'+_updateTime+'"';
                      var parmQuery3 = 'INSERT INTO accesslevels '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                      //console.log('parmQuery3= '+parmQuery3);
                      return parmQuery3;
               };
               return {insertAccessLevel : insertAccessLevel};
              })();//feb--end of revealing module

  // Build and execute the insert query
  var strSQL = buildAccessLevelQuery.insertAccessLevel(badgeID, empID);
  console.log('POST strSQL= '+ strSQL);  
  var query = connectionAL.query(strSQL, function(err, result) {

       if (err) {
          console.log(err)
          sess.error = 'There was a problem updating the mobss database: '+err;
          connectionAL.end();
          callback(err, result);
        } else {
          //console.log(err);
          callback(null, result);
        };
      });//feb--end of connection.query
}; //feb--end of post handler

