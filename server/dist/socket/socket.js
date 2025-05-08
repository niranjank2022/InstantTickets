'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.initializeSocket = initializeSocket;
exports.getIo = getIo;
const socket_io_1 = require('socket.io');
const socket_controller_1 = require('./socket.controller');
const logger_1 = require('../config/logger');
let io = null;
function initializeSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log(logger_1.messages.CLIENT_CONNECTED(socket.id));
        socket.on('selectSeat', (data) => (0, socket_controller_1.selectSeatController)(socket, data));
        socket.on('releaseSeat', (data) => (0, socket_controller_1.releaseSeatController)(socket, data));
        socket.on('confirmSeat', (data) => (0, socket_controller_1.confirmSeatController)(socket, data));
        socket.on('disconnect', () => console.log(logger_1.messages.CLIENT_DISCONNECTED(socket.id)));
    });
    return io;
}
function getIo() {
    if (io == null) {
        throw new Error(logger_1.messages.SOCKET_INIT_ERROR);
    }
    return io;
}
//# sourceMappingURL=socket.js.map