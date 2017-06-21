var datetime = require('fs');
var mysql    = require('mysql');




//feb--handler for creating the empBadge information
// right now, as it was in original command center, is simply created
// one to one with ingested cardholder information
exports.createInviteList = function(connection, ListName, ListComment, callback) {


var buildInviteListQuery = (function() {
                    var insertInviteList = function(field1, field2) {
    
                      var _ListName = field1;
                      var _ListComment = field2;
                      
                      
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _qFields = '(ListName, ListComment, updateTime)';
                      var _qValues = '("'+_ListName+'", "'+_ListComment+'", "'+_updateTime+'")';                                                      
                      var _qUpdates = 'ListName="'+_ListName+'", ListComment="'+_ListComment+'"'+', updateTime="'+_updateTime+'"';
                      var parmQuery = 'INSERT INTO InviteList '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                      return parmQuery;
               };
               return {insertInviteList : insertInviteList};
              })();//feb--end of revealing module

  var strSQL = buildInviteListQuery.insertInviteList(ListName, ListComment);
  console.log("insert invite list "+strSQL);
  var query = connection.query(strSQL, function(err, result) {

                  
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    callback(err, null);
                  } else {
                    //console.log(err);
                    callback(null, result);
                };
                });//feb--end of connection.query
}; //feb--end of post handler
