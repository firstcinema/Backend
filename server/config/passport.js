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

    passport.use(require('./strategies/DiscordStrat'));

    passport.use(require('./strategies/TwitterStrat'));

    passport.use(require('./strategies/LocalStrat'));
};