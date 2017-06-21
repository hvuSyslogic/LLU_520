
//*
//* Setup file for the base + mustering application (5.0.1)
//* Creates .env file, which should then be edited at install
//* Also creates the appropriate navbar for the version
//*

'use strict';
var fs = require('fs');
var db = require('./models/db');
var mysql = require('mysql');

var navbar = '';
var dbUpdate = '';

// Array of parameters.  The first argument is setup.js itself
	var param_array = [{
		param: process.argv[2],
        value: 'VERSION='+process.argv[3]
        },
        {param: process.argv[4],
        value: 'DB_HOST='+process.argv[5]
        },
        {param: process.argv[6],
        value: 'DB_NAME='+process.argv[7]
        },
        {param: process.argv[8],
        value: 'DB_USER='+process.argv[9]
        },
        {param: process.argv[10],
        value: 'DB_PASS='+process.argv[11]
        }];


// Create appropriate menu bar options for this product release
//THIS SHOULD BE CASE DRIVE AND THE VERSION SIMPLY AN ARGUNMENT FOR SETUP.JS
console.log('parma array '+param_array[0].value);
switch (param_array[0].value)
{
   case "5.1.0":
   		navbar = './views/navbar_base_invites.jade'
   		dbUpdate='invites'
   		break;

   case "5.0.0":
   		navbar = './views/navbar_base.jade'
   		dbUpdate=''
   		break;

   case "5.0.1": 
   		navbar = './views/navbar_base_muster.jade'
   		dbUpdate='mustering'
   		break;
       
       //break;

  default: 
    navbar = './views/navbar_base.jade'
    dbUpdate=''
}
console.log('navbar '+navbar);
fs.createReadStream(navbar)
  .pipe(fs.createWriteStream('./views/navbar.jade'));



function processInput ( param_array ) {     
 fs.open('.sample510-env', 'a', 666, function( e, id ) {
 	//in some cases appends to the end of the last line rather than on a new line,
 	//so write a blank line first
 	fs.appendFileSync(id, "" + "\r\n", null, 'utf8')

 	console.log('array length is '+param_array.length);
 	for (var i=0; i<param_array.length; i++){
	   	fs.appendFileSync(id, param_array[i].value + "\r\n", null, 'utf8')
	}
	fs.close(id, function(){});
  });
 };

processInput(param_array);

fs.createReadStream('.sample510-env')
  .pipe(fs.createWriteStream('.env'));

console.log('array '+JSON.stringify(param_array));


//DATABASE UPDATE PROCESSING
//Get the connection handle
switch (dbUpdate)
{
   case "invites":
   		
		var connection = mysql.createConnection({
		 
		  host     : process.argv[5],
		  user     : process.argv[9],
		  password : process.argv[11],
		  database : process.argv[7]
		});
   		
   		 connection.connect(function(err) {
				  if (err) {
				    console.error('error doing the  connect ' + err.stack);
				  } else {
				    console.error('success doing the  connect ');
				    console.log('connection AT POINT '+connection.threadId);

				    console.log('arg59117  '+process.argv[5]+process.argv[9]+process.argv[11]+process.argv[7]);
			        //Add EventListID to events table
			        var _sql0 = "ALTER TABLE Events ADD InvitationListID int(11);";
			          connection.query(_sql0, function(err, result0) {
			          	if(!err){console.log('InvitationListID added to Events table.')}
			          });
			        
			        //Add InviteList table
			        var sq1A = "CREATE TABLE InviteList "
			        var sq1B = "(InvitationListID int(11) NOT NULL AUTO_INCREMENT, ListName varchar(100), ListComment varchar(100), UpdateTime varchar(64), "
			       	var sq1C = "KEY InvitationListID (InvitationListID)) ENGINE=MyISAM DEFAULT CHARSET=utf8;"
			        var _sql1 = sq1A+sq1B+sq1C;	        	
			        console.log('connection '+connection.threadId);
			        console.log('query format '+_sql1)
			          connection.query(_sql1, function(err, result1) {
			          	if(!err){console.log('InviteList table has been added.')}
			          });
			       
			        //Add Invitee table
			        var sq2A = "CREATE TABLE Invitees "
			        var sq2B = "(InvitationListID int(11) NOT NULL, BadgeNumber varchar(20) NOT NULL, LastName varchar(60), FirstName varchar(30), EmailAddress varchar(30), NofiticationNumber bigint(20) unsigned NOT NULL, NumberFormat varchar(40), UpdateTime varchar(64), "
			       	var sq2C = "KEY InvitationListID (InvitationListID)) ENGINE=MyISAM DEFAULT CHARSET=utf8;"
			        var _sql2= sq2A+sq2B+sq2C;	        	
			        console.log('connection '+connection.threadId);
			        console.log('query format '+_sql2)
			          connection.query(_sql2, function(err, result2) {
			          	if(!err){console.log('Invitees table has been added.')}
			          connection.end()
			          });

				};
				});
   		
        

        
         
      
   		break;
       
       //break;

}


