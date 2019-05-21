const User = require("../../models/User");
const configKeys = require('../keys');
const TwitterStrategy = require('passport-twitter').Strategy;

const twitterStrat = new TwitterStrategy({
    consumerKey: configKeys.twitter.consumerKey,
    consumerSecret: configKeys.twitter.consumerSecret,
    callbackURL: configKeys.twitter.callback,
    includeEmail: true,
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        User.findOne({
            'twitter.id': profile.id
        }, (error, user) => {
            if (error) {
                return done(error);
            }
            if (user) {
                if (user.twitter.username !== profile.username) {
                    user.twitter.username = profile.username;
                    user.save(function(error) {
                        if (error) {
                            return done(error);
                        }
                    });
                }
                return done(null, user);
            }
            if (req.user) {
                let loggedUser = req.user;
                User.updateUser(loggedUser._id, {
                    'twitter.id': profile.id,
                    'twitter.token': accessToken,
                    'twitter.username': profile.username
                });
                return done(null, loggedUser);
            }

            let newUser = new User();
            newUser.email = profile.emails[0].value;
            newUser.userName = profile.displayName;
            newUser.isVerified = true;
            newUser.twitter.id = profile.id;
            newUser.twitter.token = accessToken;
            newUser.twitter.username = profile.username;
            newUser.password = '';
            newUser.save(function(error) {
                if (error) {
                    return done(error);
                }
                return done(null, newUser);
            });
        });
    });
});

module.exports = twitterStrat;