const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

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

//const User = (module.exports = mongoose.model("User", UserSchema));

module.exports = mongoose.model('User', UserSchema);
module.exports.updateUser = function(userId, update, callback) {
    this.findByIdAndUpdate(userId, update, {
        useFindAndModify: false,
        new: true
    }, callback);
}

module.exports.comparePassword = function(attemptedPassword, hash, callback) {
    bcrypt.compare(attemptedPassword, hash, (error, isMatch) => {
        if (error) throw error;
        callback(isMatch);
    });
}