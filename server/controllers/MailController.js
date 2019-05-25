const { tokenService, emailService } = require('../services');

function sendMail(req, res) {
    let mailOptions = {
        to: req.body.mailOptions.to,
        from: req.body.mailOptions.from,
        subject: req.body.mailOptions.subject,
        html: req.body.mailOptions.html
    };

    let replacements = req.body.replacements;

    tokenService.findByUserId(req.user._id, (error, tokenObj) => {
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Could not find verification token'
            });
        }

        if (tokenObj && tokenObj.token) {
            replacements.verificationURL = getURL('confirmation', tokenObj.token);
        }
    });

    emailService.sendMail(mailOptions, replacements, (error, info) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.log(info);
        return res.status(200).json({
            success: true,
            message: `Email Sent: ${info.response}`
        });
    });
}


// Temporary
function getURL(type, token) {
    return `http://localhost:5000/api/users/${type}/${token}`;
}

module.exports = {
    sendMail
}