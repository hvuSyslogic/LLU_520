var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var beckenbauer      = require('./controllers/beckenbauer');
//feb--.lc script processing
var SimpleCGI = require('simplecgi');
const opn = require('opn');

//require('./models/db');

//* SSL CHANGES - NEXT 3 LINES
var https = require("https")
var http = require("http")
var fs = require( 'fs' );
require('dotenv').config();

// var cc = require('./routes/cc');

// attempt to use express 4 sessions, as express 3 method now deprecated
var session = require('express-session');

/**
 * SSL certificate set up, if SSL is ON and conditioned on
 * whether cert was generated with a passphrase or not
 */
//var privateKey = fs.readFileSync( 'mobsscloudcert.pem' ).toString();
//var certificate = fs.readFileSync( 'STAR_mobsscloud_com.crt' ).toString();
if (process.env.CC_SSL == "YES"){
  var privateKey = fs.readFileSync( process.env.CERT_NAME+'.key' ).toString();
  var certificate = fs.readFileSync( process.env.CERT_NAME+'.crt').toString();
  if (process.env.CERT_PASSPHRASE ==""){
     var options = {key: privateKey, cert: certificate};
  }else{
    var passphrase = process.env.CERT_PASSPHRASE
    var options = {key: privateKey, cert: certificate, passphrase: passphrase};
  }
}

var app = express();



// which index file to use
var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// following two lines work for looging in but no post data is read
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

//following lines 
//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
//--> works for login not for verifyercords app.use(bodyParser.urlencoded({limit: '50mb', extended: false, parameterLimit:50000}));
//-APR 20-> x-www and multiform both work for posting (as long as using irldecode in script).  BUT log-in does not
app.use(bodyParser.urlencoded({ extended:true, limit:1024*1024*20, type:'application/x-www-form-urlencoding'}));
//app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
//--> works for verify records not for log-in  app.use(bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding'}));

app.use(cookieParser());
app.use(require('stylus').middleware(__dirname + '/public'));
// feb-- .lc processing.  this line has to go BEFORE the app.use(express.static) line, or it doesnt run the engine.
// feb-- tried to do this through the router but couldnt get it to work
app.all(/^.+[.]lc$/, SimpleCGI(
      __dirname+'/livecode-server/livecode-server.exe', __dirname + '/public', /^.+[.]lc$/
    ));
app.use(express.static(path.join(__dirname, 'public')));

//feb-- the new express 4 sessions stuff, as express 3 method now deprecated
app.use(session({secret: 'boris', 
                 saveUninitialized: true,
                 resave: true}));


app.use(bodyParser.urlencoded({limit: '50mb', extended: false, parameterLimit:50000}));


app.use('/', routes);


//app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

///////////////////////////////////////
// daily csv sweeper                 //
///////////////////////////////////////
var CronJob = require('cron').CronJob;

if (process.env.SWEEP_SCHED != "OFF") {

    /*
    Each of the 6 ranges represent, left to right...
    Seconds: 0-59
    Minutes: 0-59
    Hours: 0-23
    Day of Month: 1-31
    Months: 0-11
    Day of Week: 0-6
    eg: runs 5 days a week at 640PM
    '00 40 18 * * 1-5'
    Six * means runs every second
     */
    //new CronJob('00 46 12 * * 1-5', function() {

    new CronJob('0 36 00 * * 0-6', function() {

    //new CronJob('* * * * * *', function() {
        beckenbauer.sweeper(function(err,rslt){
              if (err) {console.log('cron unsuccessful: ' + err);}
      });

    }, null, true, 'America/New_York');
}

// console.log('You will see this message every second');
    //this will allow us to simply add a hardcoded directory daily csv and then it will simply read the latest file in the directory and determine if there has been a change
      //console.log('the path is '+__dirname); // this looks like the application directory
        //console.log('the path is '+__filename); // this is the directory plus app.js
          //console.log('the path is '+process.argv[1]);//this is the directory plus app

var port = process.env.PORT || 3000;
/**
 * Adding a name for the listen object so we can then set the timeout length.
 * Node defaults to 2 minutes, which is too sort to wait for long inserts.
 * Have only done the for HTTP so far.
 */
var server = app.listen(port, function() {
  console.log("Listening on " + port);
 });

 server.setTimeout(10 * 60 * 1000); // 10 * 60 seconds * 1000 msecs = 10 minutes


// You can set morgan to log differently depending on your environment
//console.log(__dirname);
//app.use(logger('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/morgan.log' }));

/** 
 * If SSL enabled, create a server instance for SSL
 * 
 */
if (process.env.CC_SSL == "YES"){
 https.createServer(options,app).listen(443, function () {
  console.log('App listening on port 443!')
});
}



// Opens the url in the default browser
//if (process.env.SETUP_STS == 1){
  //console.log('getting here '+process.env.SETUP_STS)
  //opn('http://localhost:3000');
//} else{
  //opn('http://localhost:3000/setup');
//}

module.exports = app;
