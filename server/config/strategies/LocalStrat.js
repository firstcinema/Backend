const User = require("../../models/User");
const LocalStrategy = require("passport-local").Strategy;

const localStrat = new LocalStrategy({
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
});

module.exports = localStrat;