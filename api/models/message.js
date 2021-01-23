'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var messageSchema = schema({
    text: String,
    viewed: String,
    created_at: String,
    emitter: {type: schema.ObjectId, ref: 'User'},
    receiver: {type: schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Message', messageSchema);