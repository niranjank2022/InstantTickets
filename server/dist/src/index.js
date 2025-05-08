"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket/socket");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const logger_1 = require("./config/logger");
// Connect to the database
mongoose_1.default
    .connect(config_1.config.MONGODB_URI)
    .then(() => console.log(logger_1.messages.MONGODB_CONNECTION_SUCCESS))
    .catch(err => console.log(logger_1.messages.MONGODB_CONNECTION_FAILURE, err));
// Create HTTP server and initialize Socket to handle client sockets
const httpServer = http_1.default.createServer(app_1.default);
(0, socket_1.initializeSocket)(httpServer);
httpServer.listen(config_1.config.PORT, () => {
    console.log(logger_1.messages.SERVER_RUNNING);
});
exports.default = httpServer;
//# sourceMappingURL=index.js.map