
////////////////////////////////////////////////////////////////////////                                                             //
// Module for creating the empBadge information                       //
// right now, as it was in original command center, is simply created //
// one to one with ingested cardholder information                    //
////////////////////////////////////////////////////////////////////////

var datetime = require('fs');
var mysql    = require('mysql');
var db = require('./db');



exports.createEmpBadge = function(connectionEB, badgeID, empID, status, callback) {
      

      var buildEmpBadgeQuery = (function() {
              var insertEmpBadge = function(field1, field2) {
  
                    var _EmpID = field2;
                    var _iClassNumber = field1;

                    if (status == "Active"){
                      var _StatusID = '1';
                      var _StatusName = 'Active';
                    }else{
                      var _StatusID = '2'
                      var _StatusName = 'Inactive';

                    }
                    
                    var _d = new Date();
                    var _t = _d.getTime(); 
                    var _updateTime = _t;
                    
                    
                    var _qFields = '(EmpID, iClassNumber, StatusID, StatusName, updateTime)';
                    var _qValues = '("'+_EmpID+'", '+_iClassNumber+', "'+_StatusID+'", "'+_StatusName+'", "'+_updateTime+'")';                                                      
                    var _qUpdates = 'EmpID="'+_EmpID+'", iClassNumber='+_iClassNumber+''+', StatusID="'+_StatusID+'"'+', StatusName="'+_StatusName+'"'+', updateTime="'+_updateTime+'"';
                    var parmQuery3 = 'INSERT INTO empbadge '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                    //console.log('parmQuery3= '+parmQuery3);
                    return parmQuery3;
              };
             return {insertEmpBadge : insertEmpBadge};
      })();//feb--end of revealing module

        var strSQL = buildEmpBadgeQuery.insertEmpBadge(badgeID, empID);
        console.log('POST strSQL= '+ strSQL);  
        var query = connectionEB.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    connectionEB.end();
                    callback(err, result);
                  } else {
                    //console.log(err);
                    callback(null, result);
                  };
        });//feb--end of connection.query


   
}; //feb--end of module

