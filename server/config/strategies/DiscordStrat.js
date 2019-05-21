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
                if (user.discord.username !== profile.username ||
                    user.discord.discriminator !== profile.discriminator) {
                    User.updateUser(user._id, {
                        'discord.username': profile.username,
                        'discord.discriminator': profile.discriminator
                    });
                }
                return done(null, user);
            }
            if (req.user) {
                User.updateUser(req.user._id, {
                    'discord.id': profile.id,
                    'discord.token': accessToken,
                    'discord.username': profile.username,
                    'discord.discriminator': profile.discriminator
                }, (error, newUser) => {});
                return done(null, req.user);
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
        });
    });
});

module.exports = discordStrat;