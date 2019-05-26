const Token = require('../models/Token');

function findToken(token) {
    return new Promise(res => Token.findOne({ token: token }, res));
}

function findByUserId(userId) {
    return new Promise(res => Token.findOne({ _userId: userId }, res));
}

module.exports = {
    findToken,
    findByUserId
}