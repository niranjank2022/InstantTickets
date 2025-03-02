import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";

import { config } from "./config/config";
import { messages } from "./config/logger";
import { initializeSocket } from "./socket/socket";
import bookingsRouter from "./routes/booking.route";
import showsRouter from "./routes/show.route";
import venuesRouter from "./routes/venue.route";

// Create the express app
const app: Application = express();

// Add middlewares before routes
app.use(cors());
app.use(express.json());

// Mount the API routes
app.use("/apis/bookings/", bookingsRouter);
app.use("/apis/shows/", showsRouter);
app.use("/apis/venues/", venuesRouter);

// Connect to the database
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log(messages.MONGODB_CONNECTION_SUCCESS))
  .catch((err) => console.log(messages.MONGODB_CONNECTION_FAILURE, err));

// Create HTTP server and initialize Socket.IO
const httpServer = http.createServer(app);
initializeSocket(httpServer);

// Error handling middleware (optional but recommended)
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

httpServer.listen(config.PORT, () => {
  console.log(messages.SERVER_RUNNING);
});

export { app, httpServer };
