const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();

// Authenticate

const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.json({
            success: false,
            message: "You are not authenticated"
        });
    } else {
        return next();
    }
};

router.get("/user", authMiddleware, (req, res) => {
    res.send({
        success: true,
        message: 'User account found',
        user: req.user
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send({ success: false, message: 'Incorrect Username or Password' });
        }

        if (!user.isVerified) {
            return res.send({
                success: true, // Change this back to false
                message: 'Your account has not been verified'
            });
        }
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.send({ success: true, message: 'Successfully Logged In' });
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout();
    return res.status(200).send();
});

module.exports = router;