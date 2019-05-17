const passport = require("passport");

const user = function(req, res) {
    res.send({
        success: true,
        message: 'User account found',
        user: req.user
    });
}

const login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
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
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.send({ success: true, message: 'Successfully Logged In' });
        });
    })(req, res, next);
}

const logout = function(req, res) {
    req.logout();
    return res.status(200).send();
}

const authenticate = function(strat) {
    return passport.authenticate('strat');
}

const callback = function(strat) {
    return passport.authenticate(strat, {
        successRedirect: '/',
        failureRedirect: '/login'
    });
}


const middleware = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.json({
            success: false,
            message: "You are not authenticated"
        });
    } else {
        return next();
    }
}

module.exports = {
    middleware,
    user,
    login,
    logout,
    authenticate,
    callback
}