const Token = require('../models/Token');

function saveToken(token, callback) {
    token.save(callback);
}

function findToken(token, callback) {
    Token.findOne({ token: token }, callback);
}

function findByUserId(userId, callback) {
    Token.findOne({ _userId: userId }, callback);
}

module.exports = {
    saveToken,
    findToken,
    findByUserId
}