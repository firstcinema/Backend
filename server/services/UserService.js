const bcrypt = require("bcrypt");
const User = require('../models/User');
const mongoose = require('mongoose');

function saveUser(user, callback) {
    let newUser = Object.assign(new User(), user);
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUSer.save(callback);
        });
    });
}

function deleteUser(userId) {
    User.findByIdAndDelete({
        _id: userId
    }, (error) => {
        if (error) throw error;
    });
}

function findUsers(conditions) {
    return new Promise(res => User.find(conditions, res));
}

function pagedUsers(perPage, page, limit) {
    return User.find({}).skip((perPage * page) - perPage)
        .limit(limit).sort({
            joined: 'asc'
        }).exec();
}

function count() {
    return User.countDocuments().exec();
}

function findSingleUser(conditions) {
    return new Promise(res => User.findOne(conditions, res));
}

function updateLogin(ipAddress, userId) {
    return new Promise(res => User.findByIdAndUpdate(userId, {
        lastSeen: Date.now(),
        remoteAddress: ipAddress
    }, {
        useFindAndModify: false,
        new: true
    }, res));
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
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user.save(callback);
                });
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