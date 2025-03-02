// Import necessary libraries
import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";

import { config } from "./config/config";
import { messages } from "./config/logger";
import { initializeSocket } from "./socket/socket";
import bookingsRouter from "./routes/bookings.routes";
import showsRouter from "./routes/shows.routes";
import venuesRouter from "./routes/venues.routes";

// Connect to the database
mongoose
    .connect(config.MONGODB_URI)
    .then(() => console.log(messages.MONGODB_CONNECTION_SUCCESS))
    .catch(() => console.log(messages.MONGODB_CONNECTION_FAILURE));

// Create the express app
const app: Application = express();

// Mount the API routes
app.use("/apis/bookings/", bookingsRouter);
app.use("/apis/shows/", showsRouter);
app.use("/apis/venues/", venuesRouter);

// Add middlewares to the app
app.use(cors());
app.use(express.json());

// Create Http server and initialize socket
const httpServer = http.createServer(app);
initializeSocket(httpServer);

export { app, httpServer };
