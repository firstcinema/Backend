const User = require('../models/User');
const mongoose = require('mongoose');

function saveUser(user, callback) {
    let newUser = Object.assign(new User(), user);
    User.addUser(newUser, err => {
        callback(err, newUser);
    });
}

function deleteUser(userId) {
    User.findByIdAndDelete({
        _id: userId
    }, (error) => {
        if (error) throw error;
    });
}

function findUsers(conditions, callback) {
    User.find(conditions, callback);
}

function pagedUsers(perPage, page, limit, callback) {
    User.find({}).skip((perPage * page) - perPage)
        .limit(limit).sort({
            joined: 'asc'
        }).exec(callback);
}

function count(callback) {
    User.countDocuments().exec(callback);
}

function findSingleUser(conditions, callback) {
    User.findOne(conditions, callback);
}

function updateLogin(ipAddress, userId, callback) {
    User.findByIdAndUpdate(userId, {
        lastSeen: Date.now(),
        remoteAddress: ipAddress
    }, {
        useFindAndModify: false,
        new: true
    }, callback);
}

function updateUser(userId, update, callback) {
    User.updateUser(userId, update, callback);
}

function followUser(userId, followingId, callback) {

    let bulk = User.collection.initializeUnorderedBulkOp();

    bulk.find({
        _id: userId
    }).upsert().updateOne({
        $addToSet: {
            following: mongoose.Types.ObjectId(followingId)
        }
    });

    bulk.find({
        _id: mongoose.Types.ObjectId(followingId)
    }).upsert().updateOne({
        $addToSet: {
            followers: mongoose.Types.ObjectId(userId)
        }
    });

    bulk.execute((error, doc) => {
        callback(error, doc);
    });
}

function unfollowUser(userId, followingId, callback) {

    let bulk = User.collection.initializeUnorderedBulkOp();

    bulk.find({
        _id: userId
    }).upsert().updateOne({
        $pull: {
            following: mongoose.Types.ObjectId(followingId)
        }
    });

    bulk.find({
        _id: mongoose.Types.ObjectId(followingId)
    }).upsert().updateOne({
        $pull: {
            followers: mongoose.Types.ObjectId(userId)
        }
    });

    bulk.execute((error, doc) => {
        callback(error, doc);
    });
}

function changePassword(user, attemptedPassword, newPassword, callback) {
    User.comparePassword(attemptedPassword, user.password, (isMatch) => {
        if (isMatch) {
            User.changePassword(user, newPassword, (error, newUser) => {
                callback(error, newUser);
            });
        } else {
            callback(new Error('Incorrect Password'));
        }
    });
}

module.exports = {
    count,
    saveUser,
    changePassword,
    updateUser,
    updateLogin,
    deleteUser,
    findSingleUser,
    findUsers,
    pagedUsers,
    followUser,
    unfollowUser
}