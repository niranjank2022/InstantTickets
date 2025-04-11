import http from 'http';
import mongoose from 'mongoose';
import { initializeSocket } from './socket/socket';
import 'reflect-metadata';

import app from './app';
import { config } from './config/config';
import { messages } from './config/logger';

// Connect to the database
mongoose
  .connect(config.MONGODB_URI!)
  .then(() => console.log(messages.MONGODB_CONNECTION_SUCCESS))
  .catch(err => console.log(messages.MONGODB_CONNECTION_FAILURE, err));

// Create HTTP server and initialize Socket to handle client sockets
const httpServer = http.createServer(app);
initializeSocket(httpServer);

httpServer.listen(config.PORT, () => {
  console.log(messages.SERVER_RUNNING);
});

export default httpServer;
