"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
exports.logError = logError;
const config_1 = require("./config");
exports.messages = Object.freeze({
    MONGODB_CONNECTION_SUCCESS: 'Connected to MongoDB successfully',
    MONGODB_CONNECTION_FAILURE: 'Error: MongoDB connection failure',
    SERVER_RUNNING: `Server is running on port ${config_1.config.PORT}`,
    RECORD_NOT_FOUND: 'Error: No records were found.',
    SERVER_ERROR: 'Error: Some error happened while processing the request.',
    ROUTE_NOT_FOUND: "Error: Sorry, that route doesn't exist.",
    UNKNOWN_ERROR: 'Unknown error occurred.',
    CLEARED_RECORDS: (model) => `Cleared existing ${model} records.`,
    SEEDS_RUNNING: 'Running all seed scripts.',
    SEEDS_COMPLETED: 'All seeds completed.',
    SEED_SUCCESS: (model) => `${model} seeded successfully.`,
    SEAT_ALREADY_RESERVED: 'Seat was already reserved.',
    SEAT_RESERVED_NOW: 'Seat has been reserved.',
    SEAT_BOOKED_NOW: 'Seat has been booked.',
    SEAT_NOT_FOUND: 'Seat not found.',
    SEAT_CANNOT_BOOK: "Error: Can't book this seat.",
    CLIENT_CONNECTED: (sockedId) => `New socket client connected: ${sockedId}`,
    CLIENT_DISCONNECTED: (sockedId) => `New socket client disconnected: ${sockedId}`,
    SOCKET_INIT_ERROR: 'Error: Socket.io is not initialized.',
});
function logError(error) {
    console.error('Error message: ', error.message);
    console.error('Error Stack Trace: ', error.stack);
}
//# sourceMappingURL=logger.js.map