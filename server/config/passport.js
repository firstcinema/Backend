const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

module.exports = passport => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.getById(id, (error, user) => {
            if (error) throw error;
            return done(null, user);
        });
    });

    passport.use(new LocalStrategy({
        passReqToCallback: true,
        usernameField: "userName",
        passwordField: "password"
    }, (req, userName, password, done) => {
        User.getByUserName(userName, (error, user) => {
            if (error) {
                return done(error);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect Username." });
            }

            User.comparePassword(password, user.password, isMatch => {
                if (!isMatch) {
                    return done(null, false, { message: "Incorrect Password." });
                } else {
                    return done(null, user);
                }
            });
        });
    }));
};