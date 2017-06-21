
const nodemailer = require('nodemailer');



module.exports.sendIncidentEmail = function(message, callback){
var smtpConfig = {
    //host: 'smtp.mail.com',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'admin@mobss.com',
        //pass: 'Dragonseat6000!'
        pass: 'camila80'
    }
};

var transporter = nodemailer.createTransport(smtpConfig);

// setup email data with unicode symbols
var mailOptions = {
    //from: 'dragonseat@mail.com>', // sender address
    from: 'admin@mobss.com', // sender address
    to: 'pbligh@mobss.com', // list of receivers
    subject: '!Command Center Incident!', // Subject line
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




