/////////////////////////////////////////////////////////////////////////
// Handler for creating the evacuation table from a csv file.          //
// Intention is that the PACS system would export the evacuation       //
// list at any point in time (every day/hour, etc) which would then    //
// be manually or auto-swept into the commmand center evacuation table //
/////////////////////////////////////////////////////////////////////////

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var accessLevels = require('../models/accessLevels');
var evacuation = require('../models/evacuation');




//////////////////////////////////////////////////////////////////////////////////////////////
//  Common handler for reading through a CSV file and inserting those records into the      //
//  evacuation table.                                                                       //
//  PROBABLY SHOULD CHANGE THIS TO INFILE PROCESSING & HANDLE THE LOOP ERR, see             //
//   csvImportInsert                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////

exports.csvIngest = function(file, table, callback) {
 //sess = req.session;
  sess.error = null;
  sess.success=null;
  
  console.log('made it to the csvIngest COMMON HANDLER ' + file);
	
  /**
   * This is where we would escape quotes in the csv file if we were using the read/insert
   * rather than the INFILE load.
   *   [ escape: "'"] option would go after the encoding line
   *   Then later, 
   *   [var escapeName = connection.escape(data[i][1]);]
   *   to escape the quotes for the insert.
   */
 
  fs.readFile(file, {
  //fs.readFile(req.body.fileName, {
  		encoding: 'utf-8'
		}, function(err, csvData) {
  				if (err) {
          sess.error = 'File not found.  Please check directory and file name.';
          callback(err, null);
  				}

  		csvParser(csvData, {
    		delimiter: ','
    		//columns: true
  			}, function(err, data) {
    			if (err) {
      				console.log(err);
    			} else {
      				
      				var numRows = data.length
      				
              for (var i=1; i < data.length; i++) {

                if (table = 'evacuation') {
                
                  evacuation.createEvacuationList(data[i][2], data[i][1], data[i][4], data[i][0], data[i][3], data[i][5], function(err,result){
                    if (err) {
                      console.log('Error while performing external evac query: ' + err);
                      callback(err,null);
                    }else{
                      callback(null, result);
                    }
                  });
                }

   				 }; // feb--end of for
                  
 			 }; //feb--end of else in csvParser
 		}); //feb--end of csvParser 
	}); //feb--end of fs.readfile
}; //feb--end of exports.csvIngest


