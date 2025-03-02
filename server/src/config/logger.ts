export const messages = Object.freeze({
    MONGODB_CONNECTION_SUCCESS: "Connected to MongoDB successfully",
    MONGODB_CONNECTION_FAILURE: "MongoDB connection failure",
    SERVER_RUNNING: (port: number) => `Server is running on port ${port}`,
    RECORD_NOT_FOUND: "No records were found.",
    SERVER_ERROR: "Some error happened while processing the request."
});
