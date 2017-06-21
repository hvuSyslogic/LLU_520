exports.mypostapi = function(req,res) {

console.log('am i making it this far for my post script???');


  db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var ScanDateTime;
          var ScanDate;
          for (var i=0; i < req.body.length; i++) {

          var ScanDateTime = req.body[i].data;
          var ScanDate = req.body[i].more;

          console.log('here is the data   '+ScanDateTime);

 

          var strSQL = "insert into verifyrecords(ScanDateTime,ScanDate) VALUES('"+ScanDateTime+"', '"+ScanDate+"')";
          console.log('POST strSQL= '+ strSQL);  
          var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    
                  } else {
                    //console.log(err);
                    //connection.end();
                };
                });//feb--end of connection.query
          }
        }
    });
  }; //end of for
}; //feb--end of post handler