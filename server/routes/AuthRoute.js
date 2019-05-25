const { authController } = require('../controllers/');
const router = require("express").Router();

// Authenticate
router.get("/user", authController.middleware, authController.user);
router.get("/logout", authController.logout);

// Strategies

router.post('/login', function(req, res, next) {
    return authController.login('local', req, res, next);
});


router.get('/discord', authController.authenticate('discord'));

router.get('/discord/callback', function(req, res, next) {
    return authController.login('discord', req, res, next);
});

router.get('/twitter', authController.authenticate('twitter'));
router.get('/twitter/callback', function(req, res, next) {
    return authController.login('twitter', req, res, next);
});

router.get('/google', authController.authenticate('google'));
router.get('/google/callback', function(req, res, next) {
    return authController.login('google', req, res, next);
});

module.exports = router;