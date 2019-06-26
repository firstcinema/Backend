const Token = require('../models/Token');

async function findToken(token) {
    return await Token.findOne({ token: token });
}

async function findByUserId(userId) {
    return await Token.findOne({ _userId: userId });
}

module.exports = {
    findToken,
    findByUserId
}