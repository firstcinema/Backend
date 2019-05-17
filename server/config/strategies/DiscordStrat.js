const User = require("../../models/User");
const configKeys = require('../keys');
const DiscordStrategy = require('passport-discord').Strategy;

const discordStrat = new DiscordStrategy({
    clientID: configKeys.discord.clientId,
    clientSecret: configKeys.discord.clientSecret,
    callbackURL: configKeys.discord.callback,
    scope: ['identify', 'email'],
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        User.findOne({
            'discord.id': profile.id
        }, (error, user) => {
            if (error) return done(error);

            if (user) {
                if (user.discord.username !== profile.username || user.discord.discriminator !== profile.discriminator) {
                    user.discord.username = profile.username;
                    user.discord.discriminator = profile.discriminator;
                    user.save(function(error) {
                        if (error) return done(error);
                    });
                }
                done(null, user);
            } else {
                if (req.user) {
                    let loggedUser = req.user;
                    loggedUser.discord.id = profile.id;
                    loggedUser.discord.token = accessToken;
                    loggedUser.discord.username = profile.username;
                    loggedUser.discord.discriminator = profile.discriminator;
                    loggedUser.save(function(error) {
                        if (error) {
                            return done(error);
                        }
                        done(null, loggedUser);
                    });
                }

                let newUser = new User();

                newUser.email = profile.email;
                newUser.userName = profile.username;
                newUser.isVerified = profile.verified;
                newUser.discord.id = profile.id;
                newUser.discord.token = accessToken;
                newUser.discord.username = profile.username;
                newUser.discord.discriminator = profile.discriminator;
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

module.exports = discordStrat;