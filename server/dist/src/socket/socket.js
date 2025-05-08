"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.initializeSocket = initializeSocket;
exports.getIo = getIo;
const socket_io_1 = require("socket.io");
const logger_1 = require("../config/logger");
let io = null;
exports.io = io;
function initializeSocket(server) {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    return io;
}
function getIo() {
    if (io === null) {
        throw new Error(logger_1.messages.SOCKET_INIT_ERROR);
    }
    return io;
}
//# sourceMappingURL=socket.js.map