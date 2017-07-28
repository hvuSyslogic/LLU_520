var datetime = require('node-datetime');

// this doesnt do anything yet in this module, but this is how to get current date
// in the specified timezone format
var d = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles'});

module.exports.getPastTimeStamp = function (dateTimeParm, callback) {

  
  var past = dateTimeParm;
  var pastDateTime = datetime.create(past);
  // get the current timestamp of the past 
  setTimeout(function () {
        var pastTime = pastDateTime.getTime();
        // this would be 1420038000000 
        console.log('inside date time 1 ' + pastTime);
        callback(null, pastTime);
        // this would be 2015-01-01 00:00:00 
        console.log('inside datetime 2 ' + new Date(1420038000000));
}, 1000);
};  


//feb--returns the time stamp (number of milliseconds) for a given date 
module.exports.syncGetPastTimeStamp = function (dateTimeParm) {
  var past = dateTimeParm;
  var pastDateTime = datetime.create(past);
  // get the current timestamp of the past 
  var pastTime = pastDateTime.getTime();
  var pastTimeDate = new Date(pastTime);
  // this would be 1420038000000 
  console.log('inside date time 1.5 ' + pastTimeDate);
  console.log('inside date time 1 ' + pastTime);
  console.log('inside date time 1.5 ' + pastTimeDate);
  // this would be 2015-01-01 00:00:00 
  console.log('inside datetime 2 ' + new Date(pastTime));
  return pastTime;
};

//feb--returns the date for a given time stamp 
module.exports.syncGetPastDateFromStamp = function (dateTimeParm) {
  var past = dateTimeParm;
  var pastTimeDate = new Date(past);
  // this would be 1420038000000 
  console.log('inside datetimeparm ' + dateTimeParm);

  console.log('inside PastDate ' + JSON.stringify(pastTimeDate));
  return pastTimeDate;
};

//feb--returns any date string or date object in mobss db format YYYY/MM/DD HH:MM:SS
module.exports.syncFormatDateStringForDB = function (dateTimeParm) {
  var dt = datetime.create(dateTimeParm);
  var formatted = dt.format('Y/m/d H:M:S');
// e.g. 04/28/2015 21:13:09 
  console.log('inside formatted ' + formatted);
  return formatted;
};

//feb--returns the  time in mobss db format YYYY/MM/DD HH:MM:SS
module.exports.syncCurrentDateTimeforDB = function () {
  var currentStamp = new Date();
  var dt = datetime.create(currentStamp);
  var currentForDB = dt.format('Y-m-d H:M:S');
  return currentForDB;
};

//feb--returns the current date in screen date format YYYY/MM/DD
module.exports.syncGetDateInDisplayFormat = function (dateParm) {
  var dt = datetime.create(dateParm);
  var formatForDisplay = dt.format('Y-m-d H:M:S');
  return formatForDisplay;
};

//feb--returns the current time in screen time format --:-- --
module.exports.syncGetTimeInDisplayFormat = function (timeParm) {
  var dt = datetime.create(timeParm);
  var formatForDisplay = dt.format('H:M:S');
  return formatForDisplay;
};

