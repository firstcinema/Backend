const mongoose = require("mongoose");

// TTL (Time To Live) measured in seconds
// Default: 12 hours
const timeToLive = 43200;

const TokenSchema = mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: timeToLive
    }
});

const Token = (module.exports = mongoose.model("Token", TokenSchema));