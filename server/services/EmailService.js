const config = require('../config/keys');

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const handlebars = require('handlebars');


const transporter = nodemailer.createTransport(sgTransport(config.emails));


function sendMail(options, replacements, callback) {
    var template = handlebars.compile(options.html.default);
    var mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: template(replacements)
    };

    transporter.sendMail(mailOptions, function(error, info) {
        callback(error, info);
    });
}

module.exports = {
    sendMail
}