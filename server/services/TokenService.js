const Token = require('../models/Token');

const saveToken = (token, callback) => {
    token.save(callback);
}

const findToken = (token, callback) => {
    Token.findOne({ token: token }, callback);
}

const findByUserId = (userId, callback) => {
    Token.findOne({ _userId: userId }, callback);
}
module.exports = {
    saveToken,
    findToken,
    findByUserId
};