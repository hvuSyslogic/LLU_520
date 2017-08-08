///////////////////////////////////////////////////////////////////////////////////////////
// This module is used to send messages to admininstrators if there is a serious db issue//
// or the sweep processing fails                                                         //
///////////////////////////////////////////////////////////////////////////////////////////


const nodemailer = require('nodemailer');

////////////////////////////////////////////////////////////////////////////
// The following module emails attendance reports to user's email address //
////////////////////////////////////////////////////////////////////////////

module.exports.sendAttendanceEmail = function(subject, message, to, fileName, callback){
var smtpConfig = {
    //host: 'smtp.mail.com',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        //pass: 'Dragonseat6000!'
        pass: process.env.EMAIL_PASS
    }
};

var transporter = nodemailer.createTransport(smtpConfig);

// setup email data with unicode symbols
var mailOptions = {
    //from: 'dragonseat@mail.com>', // sender address
    from: process.env.EMAIL_FROMADDR, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: message, //
    //text: 'there was an error connecting to the database', //
    html: '<b>'+message+'</b>', // html body
    attachments: [
        {   // utf-8 string as an attachment
            //path: 'c:/users/bligh/dropbox/JH061617-master/DEVHEAD - Copy/Public/Reports/my_cron_file.txt'
            path: './Public/Reports/'+fileName


        }]

};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
};


//////////////////////////////////////////////////////////////////////////
// Following module emails in-application incidents and alerts to mobss //
//////////////////////////////////////////////////////////////////////////

module.exports.sendIncidentEmail = function(subject, message, to, callback){
var smtpConfig = {
    //host: 'smtp.mail.com',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        //pass: 'Dragonseat6000!'
        pass: process.env.EMAIL_PASS
    }
};

var transporter = nodemailer.createTransport(smtpConfig);

// setup email data with unicode symbols
var mailOptions = {
    //from: 'dragonseat@mail.com>', // sender address
    from: process.env.EMAIL_FROMADDR, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: message, //
    //text: 'there was an error connecting to the database', //
    html: '<b>'+message+'</b>' // html body
    
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
};




