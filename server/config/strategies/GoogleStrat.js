const User = require("../../models/User");
const configKeys = require('../keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleStrat = new GoogleStrategy({
    clientID: configKeys.google.clientId,
    clientSecret: configKeys.google.clientSecret,
    callbackURL: configKeys.google.callback,
    scope: ['profile', 'email', 'openid'],
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {

        User.findOne({
            'google.id': profile.id
        }, (error, user) => {
            if (error) return done(error);

            if (user) {
                if (user.google.username !== profile.username) {
                    user.google.username = profile.username;
                    user.save(function(error) {
                        if (error) {
                            return done(error);
                        }
                    });
                }
                done(null, user);
            } else {

                if (req.user) {
                    let loggedUser = req.user;
                    loggedUser.google.id = profile.id;
                    loggedUser.google.token = accessToken;
                    loggedUser.google.username = profile.displayName;
                    loggedUser.save(function(error) {
                        if (error) {
                            return done(error);
                        }
                        done(null, loggedUser);
                    });
                }

                let newUser = new User();
                newUser.firstName = profile.name.givenName;
                newUser.lastName = profile.name.familyName;
                newUser.email = profile.emails[0].value;
                newUser.userName = profile.displayName;
                newUser.isVerified = true;
                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.google.username = profile.displayName;
                newUser.password = '';
                newUser.save(function(error) {
                    if (error) {
                        return done(error);
                    }
                    done(null, newUser);
                });
            }
        });
    });
});

module.exports = googleStrat;