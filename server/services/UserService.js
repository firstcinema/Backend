const User = require('../models/User');
const mongoose = require('mongoose');
const saveUser = (user, callback) => {
    let newUser = Object.assign(new User(), user);
    User.addUser(newUser, err => {
        callback(err, newUser);
    });
};

const deleteUser = (userId) => {
    User.deleteById(userId, (error) => {
        if (error) throw error;
    });
};

const findUsers = (conditions, callback) => {
    User.findUsers(conditions, callback);
};

const pagedUsers = (perPage, page, limit, callback) => {
    User.find({}).skip((perPage * page) - perPage)
        .limit(limit).sort({
            joined: 'asc'
        }).exec(callback);
};

const count = (callback) => {
    User.countDocuments().exec(callback);
}


const findOneUser = (conditions, callback) => {
    User.findOneUser(conditions, callback);
};

const updateUser = (userId, update, callback) => {
    User.updateUser(userId, update, callback);
    //User.findByIdAndUpdate(userId, update, { new: true }, callback);
}

const followUser = function(userId, followingId, callback) {

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

module.exports = {
    count,
    saveUser,
    updateUser,
    deleteUser,
    findOneUser,
    findUsers,
    pagedUsers,
    followUser
};