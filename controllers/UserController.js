const { userService, tokenService } = require('../services');
const Token = require('../models/Token');
const crypto = require('crypto');

async function createUser(req, res, next) {
    try {
        let user = await userService.saveUser({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        });

        var token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        token.save();

        req.login(user, (error) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        });

        res.status(201).json({
            success: true,
            message: "Successfully Registered!",
            user: user
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
        next();
    }
}

function deleteUser(req, res, next) {
    userService.deleteUser(req.body.id);
    res.status(200).json({
        success: true,
        message: "User Deleted"
    });
}

async function findSingleUser(req, res, next) {
    try {
        let user = await userService.findSingleUser(req.params);
        res.status(200).json({
            success: true,
            message: 'User Exists',
            user: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
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

async function updateUser(req, res, next) {
    try {
        let user = await userService.updateUser(req.params.userId, req.body);
        return res.json({
            success: true,
            message: 'Successfully Updated',
            user: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function confirmUser(req, res) {
    let token = await tokenService.findToken(req.params.token);

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'We were unable to verify your account, verification token may have expired.'
        });
    }

    let user = await userService.findSingleUser({ _id: token._userId });

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
    try {
        await userService.updateUser({ _id: user._id }, { isVerified: true });
        res.status(200).json({
            success: true,
            message: 'Your account has successfully been verified. Please log in'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function resendTokenPost(req, res) {
    let user = await userService.findSingleUser({ email: req.body.email });
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

    try {
        var token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        await token.save();
        res.status(201).json({
            success: true,
            message: `A new verification email has been sent to ${user.email}`
        });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
}

async function followUser(req, res) {
    const userId = req.user._id;
    const followingId = req.body.followingId;
    try {
        await userService.followUser(userId, followingId);
        return res.status(200).json({
            success: true,
            message: 'User Followed'
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

async function unfollowUser(req, res) {
    const userId = req.user._id;
    const followingId = req.body.followingId;
    try {
        await userService.unfollowUser(userId, followingId);
        return res.status(200).json({
            success: true,
            message: 'User Unfollowed'
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    };
}

async function changePassword(req, res) {
    let user = req.user;
    let attemptedPassword = req.body.currentPassword;
    let password = req.body.password;
    try {
        await userService.changePassword(user, attemptedPassword, password);
        return res.status(200).json({
            success: true,
            message: 'Password successfully updated'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
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