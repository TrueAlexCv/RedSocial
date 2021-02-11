'use strict';

const express = require('express');
const api = express.Router();

// Middlewares:
const md_auth = require('../middlewares/authenticated');

// Controllers:
const MessageController = require('../controllers/message');

api.post('/add-message', md_auth.ensureAuth, MessageController.addMessage);
api.post('/get-messages', md_auth.ensureAuth, MessageController.getMessages);
api.post('/get-emitted-messages', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.post('/get-received-messages', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.post('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);
api.delete('/delete-message/:id', md_auth.ensureAuth, MessageController.deleteMessage);

module.exports = api;
