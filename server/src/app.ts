// Import necessary libraries
import express, { Application } from "express";
import mongoose from "mongoose";

import { config } from "./config/config";
import { messages } from "./config/logger";

// Connect to the database
mongoose
    .connect(config.MONGODB_URI)
    .then(() => console.log(messages.mongodbConnectionSuccess))
    .catch(() => console.log(messages.mongodbConnectionError));

// Create the express app
const app: Application = express();

export default app;