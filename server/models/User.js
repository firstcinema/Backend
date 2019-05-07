const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
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
        type: String,
        required: true
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
    following: [String],
    followers: [String]
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.findOneUser = (conditions, callback) => {
    return User.findOne(conditions, callback);
};
module.exports.findUsers = (conditions, callback) => {
    return User.find(conditions, callback);
};

module.exports.getById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.getByUserName = (userName, callback) => {
    User.findOne({ userName: userName }, callback);
};

module.exports.addUser = (user, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user.save(callback);
        });
    });
};

module.exports.deleteById = (userId, callback) => {
    User.findByIdAndDelete({
            _id: userId
        },
        callback
    );
};

module.exports.deleteByName = (name, callback) => {
    User.deleteMany({ userName: name }, callback);
};

module.exports.comparePassword = (attemptedPassword, hash, callback) => {
    bcrypt.compare(attemptedPassword, hash, (error, isMatch) => {
        if (error) throw error;
        callback(isMatch);
    });
};