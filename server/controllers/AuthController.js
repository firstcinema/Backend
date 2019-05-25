const passport = require("passport");
const { userService } = require('../services/');


function user(req, res) {
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

        req.login(user, error => {
            if (error) {
                return next(error);
            }
            // Update last seen and ip address
            userService.updateLogin(req.ip, user._id, (error) => {
                if (error) console.log(error);
                return res.redirect('/');
            });
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