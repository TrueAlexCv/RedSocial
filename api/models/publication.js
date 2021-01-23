'use strict';

const mongoose = require('mongoose');
var schema = mongoose.Schema;

var publicationSchema = schema({
    text: String,
    file: String,
    created_at: String,
    user: {type: schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Publication', publicationSchema);