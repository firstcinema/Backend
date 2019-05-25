const { userService, tokenService } = require('../services');
const Token = require('../models/Token');
const crypto = require('crypto');

function createUser(req, res, next) {
    userService.saveUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    }, (error, user) => {
        if (error) {
            res.json({
                success: false,
                message: "Username or Email already exists"
            });
            next();
        } else {
            var token = new Token({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
            });
            tokenService.saveToken(token, (error) => {
                if (error) return res.status(500).send({ success: false, message: error.message });
                res.status(201).json({
                    success: true,
                    message: "Successfully Registered!"
                });
            });
        }
    });
}

function deleteUser(req, res, next) {
    userService.deleteUser(req.body.id);
    res.json({
        success: true,
        message: "User Deleted"
    });
}

function findSingleUser(req, res, next) {
    userService.findSingleUser(req.params, (error, users) => {
        if (error) throw error;
        res.json({
            success: true,
            message: 'User Exists',
            user: users
        });
    });
}

function findUser(req, res, next) {
    userService.findUsers(req.params, (error, users) => {
        if (error) throw error;
        return res.json({
            success: true,
            message: 'Users Exists',
            users: users
        });
    });
}

function pagedUsers(req, res, next) {
    var perPage = 15;
    var limit = 15;
    var page = Math.max(1, req.params.page || 1);

    userService.pagedUsers(perPage, page, limit, (error, users) => {
        if (error) throw error;
        userService.count((error, count) => {
            return res.json({
                success: true,
                message: 'Users Found!',
                limit: limit,
                perPage: perPage,
                currentPage: page,
                pages: Math.ceil(count / perPage),
                users: users
            });
        });
    });
}

function updateUser(req, res, next) {
    userService.updateUser(req.params.userId, req.body, (error, user) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'An Error Has Occured: ' + error
            });
        }

        return res.json({
            success: true,
            message: 'Successfully Updated',
            user: user
        });
    });
}

function confirmUser(req, res) {
    tokenService.findToken(req.params.token, (error, token) => {

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'We were unable to verify your account, verification token may have expired.'
            });
        }

        userService.findSingleUser({
            _id: token._userId
        }, (error, user) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }

            if (!user) return res.status(400).json({
                success: false,
                message: 'We were unable to find a user associated with the provided token.'
            });

            if (user.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'Your account has already been verified.'
                });
            }

            userService.updateUser({
                _id: user._id
            }, {
                isVerified: true
            }, (error) => {
                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                res.status(200).json({
                    success: true,
                    message: 'Your account has successfully been verified. Please log in'
                })
            });
        });
    });
}

function resendTokenPost(req, res) {
    userService.findSingleUser({
        email: req.body.email
    }, (error, user) => {
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'We were unable to find a user associated with this email address.'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Your account has already been verified.'
            });
        }

        var token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        tokenService.saveToken(token, (error) => {
            if (error) return res.status(500).send({ success: false, message: error.message });
            res.status(201).json({
                success: true,
                message: `A new verification email has been sent to ${user.email}`
            });
        });
    });
}

function followUser(req, res) {
    const userId = req.user._id;
    const followingId = req.body.followingId;
    userService.followUser(userId, followingId, (error, doc) => {
        if (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
        return res.status(200).json({
            success: true,
            message: 'User Followed'
        });
    });
}

function unfollowUser(req, res) {
    const userId = req.user._id;
    const followingId = req.body.followingId;
    userService.unfollowUser(userId, followingId, (error, doc) => {
        if (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
        return res.status(200).json({
            success: true,
            message: 'User Unfollowed'
        });
    });
}

function changePassword(req, res) {
    let user = req.user;
    let attemptedPassword = req.body.currentPassword;
    let password = req.body.password;
    userService.changePassword(user, attemptedPassword, password, (error, newUser) => {
        if (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Password successfully updated'
        })
    });
}

module.exports = {
    createUser,
    changePassword,
    updateUser,
    confirmUser,
    resendTokenPost,
    deleteUser,
    findSingleUser,
    findUser,
    pagedUsers,
    followUser,
    unfollowUser
};