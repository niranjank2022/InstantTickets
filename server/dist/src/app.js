"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./config/logger");
const booking_route_1 = __importDefault(require("./routes/booking.route"));
const show_route_1 = __importDefault(require("./routes/show.route"));
const venue_route_1 = __importDefault(require("./routes/venue.route"));
// Create the express app
const app = (0, express_1.default)();
// Add middlewares before routes
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mount the API routes
app.use('/apis/bookings/', booking_route_1.default);
app.use('/apis/shows/', show_route_1.default);
app.use('/apis/venues/', venue_route_1.default);
// Error handling middleware (optional but recommended)
app.use((req, res) => {
    res.status(404).json({ message: logger_1.messages.ROUTE_NOT_FOUND });
});
exports.default = app;
//# sourceMappingURL=app.js.map