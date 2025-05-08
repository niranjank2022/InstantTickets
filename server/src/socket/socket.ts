import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { messages } from '../config/logger';
import { selectSeatController, releaseSeatController } from './socket.controller';

let io: Server | null = null;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log(messages.CLIENT_CONNECTED(socket.id));
    socket.on('selectSeat', data => selectSeatController(socket, data));
    socket.on('releaseSeat', data => releaseSeatController(socket, data));
    socket.on('disconnect', () => console.log(messages.CLIENT_DISCONNECTED(socket.id)));
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
