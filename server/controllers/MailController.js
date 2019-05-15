const { tokenService, emailService } = require('../services');

function sendMail(req, res) {
    let mailOptions = {
        to: req.body.mailOptions.to,
        from: req.body.mailOptions.from,
        subject: req.body.mailOptions.subject,
        html: req.body.mailOptions.html
    };

    let replacements = req.body.replacements;
    //replacements.user = req.user;

    tokenService.findByUserId(req.user._id, (error, token) => {
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Could not find verification token'
            });
        }
        replacements.verificationURL = `http://localhost:5000/api/users/confirmation/${token.token}`;

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
    });
}

module.exports = {
    sendMail
}