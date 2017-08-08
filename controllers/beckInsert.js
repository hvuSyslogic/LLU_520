
/////////////////////////////////////////////////////////////////////////////////////
// You are in this module if the source file is S2 (too complicated for INFILE) OR //
// Infile is disabled on the instance.                                             //
/////////////////////////////////////////////////////////////////////////////////////

module.exports.sweepInsert = function(csvFileName, callback){
	

var csvImportInsertS2 = require('./csvImportInsertS2');
var db = require('../models/db');
var exportSource = process.env.EXPORT_SOURCE;
var caller = "sweep"

// Add other source types that require INSERT processing as they occur.
// If INFILE is disabled (one of the reasons you end up in this module)
// and it's not S2, this is no current support for sweep. This can be added
// and directed as neessary to the case statement below.

// First, get 3 connections to use for the INSERT processing to people, empbadge and accesslevels.
// This will improve performance for very large files.
// 
 	db.createConnection(function(err,res1){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = res1;
          console.log('here is the csvImport PEOPLE connnection '+res1.threadId);
          db.createConnection(function(err,res2){  
              if (err) {
                console.log('Error while performing common connect query: ' + err);
                callback(err, null);
              }else{
                //process the i/o after successful connect.  Connection object returned in callback
                var connectionEB = res2;
                console.log('here is the csvImport empBadge connnection '+res2.threadId);
                db.createConnection(function(err,res3){  
                  if (err) {
                    console.log('Error while performing common connect query: ' + err);
                    callback(err, null);
                  }else{
                    //process the i/o after successful connect.  Connection object returned in callback
                    var connectionAL = res3;
                    console.log('here is the csvImport accesslevels connnection '+res3.threadId);

                    switch (exportSource)
					    {
					       case "S2":
					       
					        csvImportInsertS2.processInsert (connection, connectionEB, connectionAL, caller, csvFileName, function(err,reslt){
					        if (err) {console.log('a problem occurred, attempting to call beck insert S2')}
					        });

					        break;

					      default: 
					        // currently no support for non-S2 INSERT sweep 
					    }


                   }
                });
               }
            });
      	}
	});	            
 

        
};




