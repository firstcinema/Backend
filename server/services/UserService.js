const User = require('../models/User');

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
    User.find({}).skip((perPage * page) - perPage).limit(limit).exec(callback);
};

const count = (callback) => {
    User.count().exec(callback);
}


const findOneUser = (conditions, callback) => {
    User.findOneUser(conditions, callback);
};

const updateUser = (userId, update, callback) => {
    User.updateUser(userId, update, callback);
    //User.findByIdAndUpdate(userId, update, { new: true }, callback);
}

module.exports = {
    count,
    saveUser,
    updateUser,
    deleteUser,
    findOneUser,
    findUsers,
    pagedUsers
};