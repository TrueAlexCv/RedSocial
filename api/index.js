'use strict';

const mongoose = require('mongoose');
const app = require('./app');
const port = 3800;

const chalk = require('chalk');
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Conexión MongoDB:
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/RedSocial",
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log(`${chalk.yellow('MongoDB')} conectado a la base de datos: ${chalk.green('RedSocial')}`);
    })
    .catch(error => console.log(error));

// SocketIO:
io.on('connection', function (socket) {
    const id_handshake = socket.id;
    let {payload} = socket.handshake.query;
    console.log(`${chalk.blue(`Nuevo dispositivo conectado: ${id_handshake}`)}`);
    if (!payload) {
        console.log(`${chalk.red(`Sin payload`)}`);
    } else {
        payload = JSON.parse(payload)
        socket.join(`room_${payload.id}`); //Creamso una sala para el usaurio
        console.log(`${chalk.yellow(`El dispositivo ${id_handshake} se unio a -> ${`room_${payload.id}`}`)}`);
        socket.emit('message', {
            msg: `Hola tu eres el dispositivo ${id_handshake}, perteneces a la sala room_${payload.id}, de ${payload.user}`
        });

        socket.on('default', function (res) {

            switch (res.event) {
                case 'message':

                    const inPayloadCookie = JSON.parse(res.cookiePayload);
                    const inPayload = res.payload;
                    io.to(`room_${inPayloadCookie.id}`).emit('message', {
                        msg: `Mensaje a todos los dispositivos de la sala room__${inPayloadCookie.id}: ${inPayload.message}`
                    });

                    break;
            }

        }); // listen to the event
    }
    ;

    // console.log( socket.handshake.headers['user-agent']); //Obtener navegador


    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

// Conexión API:
app.listen(port, () => {
    console.log(`${chalk.blue('Servidor')} escuchando por el puerto: ${chalk.green(3800)}`);
});

// Conexión SocketIO:
server.listen(5000, function () {
    console.log(`${chalk.red('Socket')} escuchando por el puerto: ${chalk.green('5000')}`);
});
