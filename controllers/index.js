const userController = require('./UserController');
const filmController = require('./FilmController');
const mailController = require('./MailController');
const authController = require('./AuthController');
module.exports = {
    userController,
    filmController,
    authController,
    mailController
};