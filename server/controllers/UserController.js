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
            token.save().then(token => {
                res.status(201).json({
                    success: true,
                    message: "Successfully Registered!"
                });
            }).catch(error => {
                return res.status(500).send({ success: false, message: error.message });
            });
        }
    });
}

function deleteUser(req, res, next) {
    userService.deleteUser(req.body.id);
    res.status(200).json({
        success: true,
        message: "User Deleted"
    });
}

function findSingleUser(req, res, next) {
    userService.findSingleUser(req.params).then(user => {
        res.status(200).json({
            success: true,
            message: 'User Exists',
            user: user
        });
    }).catch(error => {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    });
}

function findUser(req, res, next) {
    userService.findUsers(req.params).then(users => {
        return res.json({
            success: true,
            message: 'Users Exists',
            users: users
        });
    }).catch(error => {
        throw error;
    });
}

function pagedUsers(req, res, next) {
    var perPage = 15;
    var limit = 15;
    var page = Math.max(1, req.params.page || 1);
    userService.pagedUsers(perPage, page, limit).then(users => {
        userService.count().then(count => {
            return res.status(200).json({
                success: true,
                message: 'Users Found!',
                limit: limit,
                perPage: perPage,
                currentPage: page,
                pages: Math.ceil(count / perPage),
                users: users
            });
        });
    }).catch(error => {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    });
}

function updateUser(req, res, next) {
    userService.updateUser(req.params.userId, req.body).then(user => {
        return res.json({
            success: true,
            message: 'Successfully Updated',
            user: user
        });
    }).catch(error => {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    });
}

function confirmUser(req, res) {
    tokenService.findToken(req.params.token).then(token => {
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'We were unable to verify your account, verification token may have expired.'
            });
        }

        userService.findSingleUser({
            _id: token._userId
        }).then(user => {

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
            }).then(() => {
                res.status(200).json({
                    success: true,
                    message: 'Your account has successfully been verified. Please log in'
                })
            }).catch(error => {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            });
        }).catch(error => {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        });
    }).catch(error => {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    });
}

function resendTokenPost(req, res) {
    userService.findSingleUser({
        email: req.body.email
    }).then(user => {
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

        token.save().then(token => {
            res.status(201).json({
                success: true,
                message: `A new verification email has been sent to ${user.email}`
            });
        }).catch(error => {
            return res.status(500).send({ success: false, message: error.message });
        });
    }).catch(error => {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    });
}

function followUser(req, res) {
    const userId = req.user._id;
    const followingId = req.body.followingId;
    userService.followUser(userId, followingId).then(doc => {
        console.log(doc); // Curious what this object contains
        return res.status(200).json({
            success: true,
            message: 'User Followed'
        });
    }).catch(error => {
        return res.json({
            success: false,
            message: error.message
        });
    });
}

function unfollowUser(req, res) {
    const userId = req.user._id;
    const followingId = req.body.followingId;
    userService.unfollowUser(userId, followingId).then(doc => {
        console.log(doc); // Curious what this object contains
        return res.status(200).json({
            success: true,
            message: 'User Unfollowed'
        });
    }).catch(error => {
        return res.json({
            success: false,
            message: error.message
        });
    });
}

function changePassword(req, res) {
    let user = req.user;
    let attemptedPassword = req.body.currentPassword;
    let password = req.body.password;
    userService.changePassword(user, attemptedPassword, password).then(newUser => {
        return res.status(200).json({
            success: true,
            message: 'Password successfully updated'
        })
    }).catch(error => {
        return res.status(500).json({
            success: false,
            message: error.message
        });
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
}