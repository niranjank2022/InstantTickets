import http from 'http';
import mongoose from 'mongoose';
import { initializeSocket } from './socket/socket';

import app from './app';
import { config } from './config/config';
import { messages } from './config/logger';
import { startSeatCleanupJob } from './socket/seatCleanup.job';

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

startSeatCleanupJob();

export default httpServer;
