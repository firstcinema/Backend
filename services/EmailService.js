const config = require('../config/keys');

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const handlebars = require('handlebars');


const transporter = nodemailer.createTransport(sgTransport(config.emails));


function sendMail(options, replacements) {
    var template = handlebars.compile(options.html.default);

    var mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: template(replacements)
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendMail
}