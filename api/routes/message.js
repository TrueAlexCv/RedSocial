'use strict';

const express = require('express');
const api = express.Router();

// Middlewares:
const md_auth = require('../middlewares/authenticated');

// Controllers:
const MessageController = require('../controllers/message');

api.post('/add-message', md_auth.ensureAuth, MessageController.addMessage);
api.get('/get-emitted-messages', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.get('/get-received-messages', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.post('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;
