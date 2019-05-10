const { emailService } = require('../services');

function sendMail(req, res) {
    let mailOptions = {
        to: req.body.to,
        from: req.body.from,
        subject: req.body.subject,
        html: req.body.html
    };

    let replacements = req.body.replacements;
    emailService.sendMail(mailOptions, replacements, (error, info) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: `Email Sent: ${info.response}`
        });
    });
}

module.exports = {
    sendMail
}