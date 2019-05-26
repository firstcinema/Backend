const { tokenService, emailService } = require('../services');

async function sendMail(req, res) {
    let mailOptions = {
        to: req.body.mailOptions.to,
        from: req.body.mailOptions.from,
        subject: req.body.mailOptions.subject,
        html: req.body.mailOptions.html
    };

    let replacements = req.body.replacements;

    let tokenObj = await tokenService.findByUserId(req.user._id);
    if (tokenObj && tokenObj.token) {
        replacements.verificationURL = getURL('confirmation', tokenObj.token);
    }

    try {
        let info = await emailService.sendMail(mailOptions, replacements);
        return res.status(200).json({
            success: true,
            message: `Email Sent: ${info.response}`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
}


// Temporary
function getURL(type, token) {
    return `http://localhost:5000/api/users/${type}/${token}`;
}

module.exports = {
    sendMail
}