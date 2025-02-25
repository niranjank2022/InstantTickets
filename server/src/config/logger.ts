export const messages = Object.freeze({
    mongodbConnectionSuccess: "Connected to MongoDB successfully",
    mongodbConnectionError: "MongoDB connection failure",
    serverRunning: (port: number) => `Server is running on port ${port}`,
});
