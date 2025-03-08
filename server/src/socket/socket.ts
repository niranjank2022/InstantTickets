import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { messages } from '../config/logger';

let io: Server | null = null;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  return io;
}

export function getIo() {
  if (io === null) {
    throw new Error(messages.SOCKET_INIT_ERROR);
  }
  return io;
}

export { io };
