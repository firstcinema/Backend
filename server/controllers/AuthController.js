const passport = require("passport");
const { userService } = require('../services/');


function user(req, res) {
    if (!req.user) {
        return res.json({
            success: false,
            message: 'User not logged in'
        });
    }
    res.send({
        success: true,
        message: 'User account found',
        user: req.user
    });
}

function login(strat, req, res, next) {
    passport.authenticate(strat, function(error, user, info) {
        if (error) {
            return next(error);
        }

        if (!user) {
            return res.send({ success: false, message: 'Incorrect Username or Password' });
        }

        if (!user.isVerified) {
            return res.send({
                success: false,
                message: 'Your account has not been verified'
            });
        }

        req.login(user, async error => {
            if (error) {
                return next(error);
            }
            // Update last seen and ip address
            try {
                await userService.updateLogin(req.ip, user._id);
                res.status(200).json({
                    success: true,
                    message: 'Successfully logged in'
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });
    })(req, res, next);
}

function logout(req, res) {
    req.logout();
    return res.status(200).send();
}

function authenticate(strat) {
    return passport.authenticate(strat);
}


function middleware(req, res, next) {
    if (req.isAuthenticated) {
        return next();
    }
    res.json({
        success: false,
        message: "You are not authenticated"
    });
}

module.exports = {
    middleware,
    user,
    login,
    logout,
    authenticate
}