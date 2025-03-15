import { Server } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import ClientIo, { Socket as ClientSocket } from 'socket.io-client';
import { initializeSocket } from '../../../src/socket/socket';
import {
  selectSeatController,
  releaseSeatController,
  confirmSeatController,
} from '../../../src/socket/socket.controller';
import { messages } from '../../../src/config/logger';
import { AddressInfo } from 'net';

// ✅ Mock Controller Functions
jest.mock('../../../src/socket/socket.controller');

describe('WebSocket Connection', () => {
  jest.setTimeout(30000); // ✅ Set timeout to 20 seconds
  let httpServer: HttpServer;
  let io: Server;
  let clientSocket: typeof ClientSocket;

  beforeAll(done => {
    // ✅ Create HTTP Server and WebSocket Server
    httpServer = createServer();
    io = initializeSocket(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ClientIo(`http://localhost:${port}`);
      clientSocket.on('connect', done); // ✅ Ensure connection is established before tests run
    });
  });

  afterAll(() => {
    io.close(); // ✅ Close the WebSocket server
    clientSocket.disconnect(); // ✅ Disconnect the client
    httpServer.close(); // ✅ Close the HTTP server
  });

  test('should establish a WebSocket connection', done => {
    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });

  test('should call selectSeatController on "selectSeat" event', () => {
    const mockData = { showId: 'show123', x: 1, y: 1 };
    clientSocket.emit('selectSeat', mockData);

    expect(selectSeatController).toHaveBeenCalled();
  });

  test('should call releaseSeatController on "releaseSeat" event', () => {
    const mockData = { showId: 'show123', x: 1, y: 1 };
    clientSocket.emit('releaseSeat', mockData);

    expect(releaseSeatController).toHaveBeenCalled();
  });

  test('should call confirmSeatController on "confirmSeat" event', () => {
    const mockData = { showId: 'show123', x: 1, y: 1 };
    clientSocket.emit('confirmSeat', mockData);

    expect(confirmSeatController).toHaveBeenCalled();
  });

  test('should log client disconnection', done => {
    const consoleSpy = jest.spyOn(console, 'log');
    clientSocket.disconnect();

    setTimeout(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(messages.CLIENT_DISCONNECTED('')));
      consoleSpy.mockRestore();
      done();
    }, 500);
  });
});
