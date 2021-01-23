'use strict';

const mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    email: String,
    password: String,
    nick: String,
    name: String,
    image: String,
    banner: String,
    biography: String,
    role: String
});

module.exports = mongoose.model('User', userSchema);