'use strict';

// Model:
const Like = require('../models/like');

function addLike(req, res) {
    const userId = req.user.sub;
    const params = req.body;
    const likeId = params.publication;

    let like = new Like();
    like.user = userId;
    like.publication = likeId;

    like.save((err, likeStored) => {
        if (err) {
            return res.status(500).send({
                message: "[ERROR]: Petición de añadir un like"
            });
        }
        if (!likeStored) {
            return res.status(404).send({
                message: "[ERROR]: No se ha podido añadir el like"
            });
        }
        return res.status(200).send({
            like: likeStored
        });
    });
}

function deleteLike(req, res) {
    const userId = req.user.sub;
    const params = req.body;
    const publicationId = params.publication;

    Like.find({
        'user': userId,
        'publication': publicationId
    }).remove((err) => {
        if (err)
            return res.status(500).send({
                message: "[ERROR]: Petición de quitar el like de la publicación"
            });
        return res.status(200).send({
            message: "Se ha quitado el like a la publicación " + publicationId
        });
    });
}

function getLikesUser(req, res) {
    let userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }

    const itemsPerPage = 5;
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    Like.find({
        user: userId
    }).populate('publication').paginate(page, itemsPerPage, (err, likes, total) => {
        if (err) {
            return res.status(500).send({
                message: "[ERROR]: Petición likes del usuario"
            });
        }
        if (!likes) {
            return res.status(404).send({
                message: "[ERROR]: El usuario no tiene likes"
            });
        }
        return res.status(200).send({
            total: total,
            itemsPerPage: itemsPerPage,
            page: page,
            likes: likes
        });
    });
}

function getLikesPublication(req, res) {
    const publicationId = req.params.id;
    if (!req.params.id) {
        return res.status(404).send({
            message: "[ERROR]: No hay ninguna publicación"
        });
    }

    const itemsPerPage = 5;
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    Like.find({
        publication: publicationId
    }).populate('user').paginate(page, itemsPerPage, (err, likes, total) => {
        if (err) {
            return res.status(500).send({
                message: "[ERROR]: Petición likes a la publicación"
            });
        }
        if (!likes) {
            return res.status(404).send({
                message: "[ERROR]: La publicación no tiene likes"
            });
        }
        return res.status(200).send({
            total: total,
            itemsPerPage: itemsPerPage,
            page: page,
            likes: likes
        });
    });
}

async function getCountLikesUser(req, res) {
    let userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    let dato;
    try {
        dato = await Like.countDocuments({
            'user': userId
        }).exec().then((value) => {
            return value;
        }).catch((err) => {
            return;
        });
    } catch(err) {
        console.log(err);
    }
    return res.status(200).send({
        message: dato
    });
}

module.exports = {
    addLike,
    deleteLike,
    getLikesUser,
    getLikesPublication,
    getCountLikesUser
}
