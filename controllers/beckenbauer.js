/** Auto-sweep module auto-imports text files using environmental variable for the application
 to locate the file and process according to file format.  Currently supports csv and a 
 quote enclosed .txt file format (AMAG).
 Certain export sources (eg S2) are too complex for INFILE and so must use insert processing.  
 Similarly, if the database on the instance has INFILE disabled (i.e.  .env variable INFILE_DISABLED=YES),
 this will fork to inserts as well.
 */


var fs = require('fs');
var path = require ('path')
var db = require('../models/db');
var mysql = require('mysql');
var fs  = require('fs');
var clearTables = require('../models/clearTables');
var emailController = require('./emailController');
var beckInsert = require('./beckInsert');
var beckPhotos = require('./beckPhotos');

var sharp = require('sharp');



module.exports.sweeper = function(callback){
	
    /**
     * Get the batch file directory from the environmental variables
     */
		            
	var dbLoc =  process.env.LOCAL_INFILE;
    var sweepFile =  process.env.SWEEP_FILE;
    var fileExtension = path.extname(process.env.SWEEP_FILE);
    var exportSource = process.env.EXPORT_SOURCE;
	var csvFileName = sweepFile;
    var strPrepend = "";
    var expFork = "";
    var strSQL = "";
    var abortSweep = "NO"
    
    /**
     * Don't do anything if INFILE is disabled and the source is not S2 or OTHER
     */

	if (process.env.INFILE_DISABLED == "YES"){
		if (process.env.EXPORT_SOURCE != "S2" ){abortSweep = "YES"};
		if (process.env.EXPORT_SOURCE != "OTHER"){abortSweep = "YES"};
	}
	        	
	if (abortSweep != "YES"){
	/**
	 * Dont do anything if the file is not in the directory
	 */
	 fs.readFile(csvFileName, {
      	encoding: 'utf-8'
    	}, function(err, csvData) {
          if (err) {
          	emailController.sendIncidentEmail('Sweep Incident!','A batch csv job did not run.  no file in directory.', process.env.FROMADDR, function(err,reslt){
	        if (err) {console.log('a problem occurred, attempting to email customer support')}
	        });
          console.log ('Batch csv job did not run, no file in the directory...'+err)
          } else {


			/**
			 * Use the common db module to get a connection
			 */
			db.createConnection(function(err,reslt){  
		        if (err) {
		          	console.log('No database connection, the batch csv job did not run... ' + err);
		          	callback(err, null);
		        }else{
		        	/**
		        	 * Process i/o after successfull connect
		        	 */
			        
		        	var connection =reslt;
				    /**
				     * Use regular INFILE or LOAD LOCAL depending on where db is located
				     * Not all datasources case use INFILE
				     */
				    switch (dbLoc)
				    {
				       case "OFF":
				        strPrepend = 'LOAD DATA INFILE '
				        break;

				      default: 
				        strPrepend = 'LOAD DATA LOCAL INFILE '
				    }
				    /**
				     * Fork into INSERT processing if the export source requires, or Infile is
				     * diaabled on the instance
				     */
				    switch (exportSource)
				    {
				       case "S2":
				          insertFork = 'YES'
				          break;

				      default: 
				        if (process.env.INFILE_DISABLED == "YES"){
				        	insertFork="YES"
				        }else{
				        	insertFork = 'NO'
				        }
				    }

				     //First clear existing records from the 3 tables
			        clearTables.clearAllFromTable(connection, 'people', function(err,rslt){
			          if (err) {
			            console.log('Error while performing people table clear: ' + err);
			            connection.end();
			            callback(err, null);
			          }else{
			          clearTables.clearAllFromTable(connection, 'accesslevels', function(err,rslt){
			            if (err) {
			              console.log('Error while performing accesslevels table clear: ' + err);
			              connection.end();
			              callback(err, null);
			            }else{
			              clearTables.clearAllFromTable(connection, 'empbadge', function(err,rslt){
			                if (err) {
			                  console.log('Error while performing empbadge table clear: ' + err);
			                  connection.end();
			                  callback(err, null);
			                }else{  

							  //Use MySQL INFILE function
			                  //to directly load people, empbadge and accesslevels tables from the csv file
			                  //this is considered up to 20 times faster than INSERT
			                  //file to table mapping can be controlled the @variables (see @dummy below)
			                  
			                  /**
			                   * Convert the filename to forward slash formats. 
			                   * chrome and firefox Browsers  will only return the filename and not the path.   this is a 
			                   * security policy by the major browsers.   IE returns path/filename. 
			                   * 
			                   */
			                  console.log('filename BEFORE replace'+csvFileName);
			                  csvFileName = csvFileName.replace(/\\/g, "/");
			                  console.log('filename AFTER replace'+csvFileName);

			                  /**
			                   * Format the date.  Timestamp for the db and then late needs to be converted to display
			                   * format whenever needed for screen display.
			                   * Was previously using CURRENT_TIMESTAMP in the INFILE SQL statement but this produces a long
			                   * spelled out date and time
			                   */
			                  //var _updateTime = new Date();  // this one produces a very long string, too long for legacy installs
				                var _d = new Date();
				                var _t = _d.getTime(); 
				                var _updateTime = _t;
			                  
			          
			           // carry out the insert fork      
			           if (insertFork == "YES"){
			           	beckInsert.sweepInsert(csvFileName, function(err,rslt){
					      if (err) {
					        console.log('Error while performing beckInsert call : ' + err);
					          connection.end();
					          callback(err, null);
					      }else{
					      	callback(null, "success")
					      	connection.end()
					      }
					    });
					   }else{


			            /** 
                         * INFILE processing.  Condition INFILE statement based on incoming file format.
                         * Currently with AMAG(comma delim, encosed quote) or 
                         * CSV (commman delim)
                         * Quote in enclosure must be escaped
                         */
                          switch (exportSource)
						    {
						       case "AMAG":
						        //strSQL = strPrepend+"'"+csvFileName+"'"+" INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (LastName, FirstName, iClassNumber, @dummy, @dummy,EmpID,@dummy, @dummy, imageName ) SET  updateTime ="+_updateTime;
                        	  	strSQL = strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' (LastName, FirstName, @var1, @dummy, @dummy, @var2, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy,@dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy, imageName ) SET iClassNumber = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), updateTime ="+_updateTime;
						          break;
						       case "ACM":
						        strSQL = strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (@var1, @var2, @dummy, @dummy, @dummy, @dummy, @dummy, FirstName, LastName, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, EmailAddr, Title, Department, Division, SiteLocation, Building, @dummy, @dummy, iClassNumber ) SET imageName=@var1, EmpID= @var2, Identifier1=@var2, updateTime ="+_updateTime;
						         break;
						      default: 
						        strSQL = strPrepend+"'"+csvFileName+"'"+" INTO TABLE people FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (empID, LastName, FirstName, title, iClassNumber, imageName) SET  updateTime ="+_updateTime;

						    }


		                  console.log('People INLINE Query '+strSQL);
		                  query = connection.query(strSQL, function(err, result) {

			                
			                   if (err) {
			                      console.log(err)
			                      callback(err, 'failed');
			                      connection.end();
			                      
			                    } else {
			                    ////////////////////////////////////////////////////////////////
			                    // Remove the .jpg extension from the imageName, if it exists //
			                    ////////////////////////////////////////////////////////////////
                     			var sqlJPG = "UPDATE people SET imageName = REPLACE(imageName, '.JPG', '')"
			                    query = connection.query(sqlJPG, function(err, result) {

			                   		if (err) { console.log('couldnt remove the .jpg extensions '+err);}
			                   		else{
			                   			var sqlJpg = "UPDATE people SET imageName = REPLACE(imageName, '.jpg', '')"
			                   			query = connection.query(sqlJpg, function(err, result) {

				                   		if (err) { console.log('couldnt remove the .jpg extensions '+err);}
				                   		
				                   		});

			                   		}
			                   	});
			                  
			         
			                     //////////////////////////////////////////////
			                     // create EMPBADGE records for each import  //
			                     //////////////////////////////////////////////
					             /**
		                         * Condition INFILE statement based on incoming file format.
		                         * Currently eith AMAG(comma delim, enclosed quote) OR 
		                         * CSV (commman delim)
		                         * Quote in enclosure must be escaped
		                         */
		                         switch (exportSource)
								    {
								       case "AMAG":
                          			  	strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' (@dummy, @dummy, @var1, @dummy, @dummy, @var2, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, UpdateTime) SET iClassNumber = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), StatusID ='1', StatusName = 'Active'";
								          break;
								       case "ACM":
                          			  	strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (@dummy, @var2, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @var1, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy,@dummy, @dummy, iClassNumber) SET EmpID = @var2, StatusID ='1', StatusName = 'Active', updateTime ="+_updateTime;
										  break;
								      default: 
				                      	strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (EmpID, @dummy, @dummy, @dummy, iClassNumber) SET StatusID ='1', StatusName = 'Active', updateTime ="+_updateTime;

								    }


			                      query = connection.query(strSQL, function(err, result) {


			                       if (err) {
			                          console.log(err)
			                          emailController.sendIncidentEmail('Sweep Incident!','There is a database problem in beckenbauer.', process.env.FROMADDR, function(err,reslt){
								        if (err) {console.log('a problem occurred, attempting to email customer support')}
								        });
			                          callback(err, 'failed');
			                          connection.end();
			                          
			                        } else {  
			                          /**
			                           * Set the empbadge records to INACTIVE for those records with EXPIRY DATE and time less than now
			                           * Only do this for .txt files -- AMAG format.  Need to generalize this case later.
			                           */
									  if (exportSource=="AMAG"){			                          
			                            var activeSQL = "select * from empbadge where STR_TO_DATE(updateTime,'%m/%d/%Y')<CURDATE()"
 										query1 = connection.query(activeSQL, function(err, result2) {if (err) {console.log('empbadge INACTIVE didnt work --')}
 										
 												console.log('the str to date query '+JSON.stringify(result2))
 												for (var i=0 ; i <result2.length; i++){
 													var inactiveSQL = 'update empbadge set StatusID=2, StatusName="Inactive" where iClassNumber='+result2[i].iClassNumber 
 													console.log('inactive query '+inactiveSQL)
 													query2 = connection.query(inactiveSQL, function(err, result) {if (err) {console.log('empbadge INACTIVE didnt work --')}

 													});

 												};
 										});
 									   } // End of the special processing for AMAG around expiry date
			                          
 									   /////////////////////////////////////////////////
					                   // create ACCESSLEVELS records for each import //
					                   /////////////////////////////////////////////////	

			                          /**
				                         * Condition INFILE statement based on incoming file format.
				                         * Currently eith AMAG(comma delim, encosed quote) or 
				                         * CSV (commman delim)
				                         * Quote in enclosure must be escaped
				                         */
				                          switch (exportSource)
										    {
										       case "AMAG":
                          						strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' (@dummy, @dummy, @var1, @dummy, @dummy, @var2) SET BadgeID = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;
										          break;
										       case "ACM":
                          						strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (@dummy, @var2, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @var1, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, BadgeID) SET EmpID = @var2, AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;
 												  break;
										      default: 
			                          	  		strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (EmpID, @dummy, @dummy, @dummy, BadgeID) SET AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;

										    }


			                          	query = connection.query(strSQL, function(err, result) {


			                             if (err) {
			                                console.log(err)
			                                emailController.sendIncidentEmail('Sweep Incident!','There is a database problem in beckenbauer.', process.env.FROMADDR, function(err,reslt){
										        if (err) {console.log('a problem occurred, attempting to email customer support')}
										        });
			                                callback(err, 'failed');
			                                connection.end();
			                                
			                              } else {  
			                               
			                                callback(null, 'success');
			                                connection.end();

			                              }
			                          });
			                        } // end of if/else on empbadge infile i/o
			                      }); // end of empbadge i/o
			                
			                    }; // end of if/else on people infile i/o
			                  }); // END of the infile processing   GOOG HERE
		           
                   } //if/else on insert fork

               }  //cleartables start 
              });
           }
          });
		 }
		});  //cleartables end

         } // if/else create connection
        }); // end create connection callback
     } // if/else err fs
 }); // end fs callback

}else{callback("cronjob did not run due to INFILE and source", null)} // end check for abort sweep
     	

/////////////////////////////////////////////////////
//Now process the photos, using the common handler //
/////////////////////////////////////////////////////

beckPhotos. photoSweep (function( err, result ) {
        if( err ) {
            console.error( "Could not sweep the photos.", err );            
        }
});


        
}; //End module




