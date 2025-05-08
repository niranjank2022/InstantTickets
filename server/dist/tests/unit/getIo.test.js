"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_1 = require("../../src/socket/socket");
const logger_1 = require("../../src/config/logger");
describe('getIo function', () => {
    let io;
    let httpServer;
    beforeEach(() => {
        httpServer = new http_1.Server();
    });
    afterEach(() => {
        io === null || io === void 0 ? void 0 : io.close();
        httpServer === null || httpServer === void 0 ? void 0 : httpServer.close();
        io = null;
    });
    test('should throw an error if Socket.IO is not initialized', () => {
        expect(() => (0, socket_1.getIo)()).toThrow(logger_1.messages.SOCKET_INIT_ERROR);
    });
    test('should return the Socket.IO instance if initialized', () => {
        io = (0, socket_1.initializeSocket)(httpServer);
        expect((0, socket_1.getIo)()).toBe(io);
    });
});
//# sourceMappingURL=getIo.test.js.map