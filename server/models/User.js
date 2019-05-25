const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        dropDups: true,
        required: true
    },
    userName: {
        type: String,
        unique: true,
        dropDups: true,
        required: true
    },
    password: {
        type: String
    },
    joined: {
        type: Date,
        default: Date.now,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    remoteAddress: {
        type: String
    },
    image: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    watched: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film'
    }],
    twitter: {
        type: Object,
        default: {}
    },
    discord: {
        type: Object,
        default: {}
    },
    google: {
        type: Object,
        default: {}
    }
    /* twitter: {
        id: String,
        token: String,
        username: String
    } */
    /* discord: {
        id: String,
        token: String,
        username: String,
        discriminator: String
    } */
    /* google: {
        id: String,
        token: String,
        username: String
    } */
});

const User = (module.exports = mongoose.model("User", UserSchema));

function findSingleUser(conditions, callback) {
    return User.findOne(conditions, callback);
}

function findUsers(conditions, callback) {
    return User.find(conditions, callback);
}

function getById(id, callback) {
    User.findById(id, callback);
}

function getByUserName(userName, callback) {
    User.findOne({ userName: userName }, callback);
}

function addUser(user, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user.save(callback);
        });
    });
}

function deleteById(userId, callback) {
    User.findByIdAndDelete({
        _id: userId
    }, callback);
}

function deleteByName(name, callback) {
    User.deleteMany({ userName: name }, callback);
}

function comparePassword(attemptedPassword, hash, callback) {
    bcrypt.compare(attemptedPassword, hash, (error, isMatch) => {
        if (error) throw error;
        callback(isMatch);
    });
}

function changePassword(user, newPassword, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user.save(callback);
        });
    });
}

function updateUser(userId, update, callback) {
    User.findByIdAndUpdate(userId, update, {
        useFindAndModify: false,
        new: true
    }, callback);
}

module.exports = {
    findSingleUser,
    findUsers,
    getById,
    getByUserName,
    addUser,
    deleteById,
    deleteByName,
    comparePassword,
    changePassword,
    updateUser
}