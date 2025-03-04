import { config } from "./config";

export const messages = Object.freeze({
    MONGODB_CONNECTION_SUCCESS: "Connected to MongoDB successfully",
    MONGODB_CONNECTION_FAILURE: "Error: MongoDB connection failure",
    SERVER_RUNNING: `Server is running on port ${config.PORT}`,
    RECORD_NOT_FOUND: "Error: No records were found.",
    SERVER_ERROR: "Error: Some error happened while processing the request.",
    ROUTE_NOT_FOUND: "Error: Sorry, that route doesn't exist.",
    UNKNOWN_ERROR: "Unknown error occurred.",
    CLEARED_RECORDS: (model: string) => `Cleared existing ${model} records.`,
    SEEDS_RUNNING: "Running all seed scripts.",
    SEEDS_COMPLETED: "All seeds completed.",
    SEED_SUCCESS: (model: string) => `${model} seeded successfully.`,
    SEAT_ALREADY_RESERVED: "Seat was already reserved.",
    SEAT_RESERVED_NOW: "Seat has been reserved.",
    SEAT_BOOKED_NOW: "Seat has been booked.",
    SEAT_NOT_FOUND: "Seat not found.",
    SEAT_CANNOT_BOOK: "Error: Can't book this seat.",
    CLIENT_CONNECTED: (sockedId: string) => `New socket client connected: ${sockedId}`,
    CLIENT_DISCONNECTED: (sockedId: string) => `New socket client disconnected: ${sockedId}`,
    SOCKET_INIT_ERROR: "Error: Socket.io is not initialized.",
});

export function logError(error: Error) {
    console.error("Error message: ", error.message);
    console.error("Error Stack Trace: ", error.stack);
}
