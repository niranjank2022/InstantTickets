import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { initializeSocket, getIo } from '../../src/socket/socket';
import { messages } from '../../src/config/logger';

describe('getIo function', () => {
  let io: SocketServer | null;
  let httpServer: HttpServer;

  beforeEach(() => {
    httpServer = new HttpServer();
  });

  afterEach(() => {
    io?.close();
    httpServer?.close();
    io = null;
  });

  test('should throw an error if Socket.IO is not initialized', () => {
    expect(() => getIo()).toThrow(messages.SOCKET_INIT_ERROR);
  });

  test('should return the Socket.IO instance if initialized', () => {
    io = initializeSocket(httpServer);
    expect(getIo()).toBe(io);
  });
});
