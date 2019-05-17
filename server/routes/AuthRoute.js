const { authController } = require('../controllers/');
const router = require("express").Router();

// Authenticate
router.get("/user", authController.middleware, authController.user);

router.post('/login', authController.login);

router.get("/logout", authController.logout);


// Strategies
router.get('/discord', authController.authenticate('discord'));
router.get('/discord/callback', authController.callback('discord'));

router.get('/twitter', authController.authenticate('twitter'));

router.get('/twitter/callback', authController.callback('twitter'));

module.exports = router;