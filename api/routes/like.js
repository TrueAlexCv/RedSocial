'use strict';

const express = require('express');
const api = express.Router();

// Middlewares:
const md_auth = require('../middlewares/authenticated');

// Controller:
const LikeController = require('../controllers/like');

api.post('/add-like', md_auth.ensureAuth, LikeController.addLike);
api.delete('/delete-like', md_auth.ensureAuth, LikeController.deleteLike);
api.get('/likes/:id?/:page?', md_auth.ensureAuth, LikeController.getLikesUser);
api.get('/likes-publication/:id?/:page?', md_auth.ensureAuth, LikeController.getLikesPublication);
api.get('/num-likes-user/:id', md_auth.ensureAuth, LikeController.getCountLikesUser);

module.exports = api;
