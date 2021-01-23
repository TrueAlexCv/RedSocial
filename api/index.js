'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/RedSocial",
        {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("La conexion a la base de datos se ha " +
                    "realizado correctamente.");
            app.listen(port, () => {
                console.log("Servidor corriendo en localhost:3800");
            });
        })
        .catch(error => console.log(error));