/** Common handler that auto-sweeps photos on a timed schedule.  Called from Beckenbaur and BeckInsert, 
The two main sweeper modules.
 */


var fs = require('fs');
var path = require ('path')
var db = require('../models/db');
var mysql = require('mysql');
var fs  = require('fs');
var emailController = require('./emailController');
var sharp = require('sharp');



module.exports.photoSweep = function(callback){
	
	

	//////////////////////////////
	//** Now process the photos //
	//////////////////////////////

	var moveFrom = process.env.PICTURE_DIR;

	var moveTo = "./public/photosforreader";

	// Loop through all the files in the source directory
	fs.readdir( moveFrom, function( err, files ) {
	        if( err ) {
	            console.error( "Could not list the picture directory.", err );            
	            //process.exit( 1 );
	        }else{ 

	        files.forEach( function( file, index ) {
	                var fromPath = path.join( moveFrom, file );
	                var toPath = path.join( moveTo, file );

	                fs.stat( fromPath, function( error, stat ) {
	                    if( error ) {
	                        console.error( "Error stating picture file.", error );
	                        return;
	                    }

	                    if( stat.isFile() )
	                        console.log( "'%s' is a file.", fromPath );
	                    else if( stat.isDirectory() )
	                        console.log( "'%s' is a directory.", fromPath );

	                    sharp(fromPath).resize(100, 150).toFile(toPath, function(err) {
	                         if (err) {
	                            console.log("One of the files is not in expected format (.jpg) "+err);
	                            return;
	                         }
	                    });

	                } );
	        } );
	        
	      }
	});


        
}; //End module




