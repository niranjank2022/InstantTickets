'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const mongoose_1 = __importDefault(require('mongoose'));
const cors_1 = __importDefault(require('cors'));
const http_1 = __importDefault(require('http'));
const config_1 = require('./config/config');
const logger_1 = require('./config/logger');
const socket_1 = require('./socket/socket');
const booking_route_1 = __importDefault(require('./routes/booking.route'));
const show_route_1 = __importDefault(require('./routes/show.route'));
const venue_route_1 = __importDefault(require('./routes/venue.route'));
// Create the express app
const app = (0, express_1.default)();
// Add middlewares before routes
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mount the API routes
app.use('/apis/bookings/', booking_route_1.default);
app.use('/apis/shows/', show_route_1.default);
app.use('/apis/venues/', venue_route_1.default);
// Connect to the database
mongoose_1.default
    .connect(config_1.config.MONGODB_URI)
    .then(() => console.log(logger_1.messages.MONGODB_CONNECTION_SUCCESS))
    .catch((err) => console.log(logger_1.messages.MONGODB_CONNECTION_FAILURE, err));
// Create HTTP server and initialize Socket.IO
const httpServer = http_1.default.createServer(app);
(0, socket_1.initializeSocket)(httpServer);
// Error handling middleware (optional but recommended)
app.use((req, res) => {
    res.status(404).send(logger_1.messages.ROUTE_NOT_FOUND);
});
httpServer.listen(config_1.config.PORT, () => {
    console.log(logger_1.messages.SERVER_RUNNING);
});
//# sourceMappingURL=index.js.map