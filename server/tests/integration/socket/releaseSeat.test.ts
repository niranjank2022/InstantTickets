import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket as ServerSocket } from 'socket.io';
import { releaseSeatController } from '../../../src/socket/socket.controller';
import { Show } from '../../../src/models/show.model';
import { SeatStatus, SocketStatus } from '../../../src/config/enum';
import { messages } from '../../../src/config/logger';

jest.mock('../../../src/models/show.model');

describe('releaseSeatController', () => {
  let io: SocketServer;
  let httpServer: HttpServer;
  let mockSocket: Partial<ServerSocket>;
  const showId = 'testShowId';

  beforeAll(() => {
    httpServer = new HttpServer();
    io = new SocketServer(httpServer);
  });

  beforeEach(() => {
    // Mock socket.emit()
    mockSocket = {
      emit: jest.fn(),
    } as Partial<ServerSocket>;

    jest.clearAllMocks();
  });

  afterAll(() => {
    io.close();
    httpServer.close();
  });

  test('should release a reserved seat and make it available', async () => {
    (Show.findById as jest.Mock).mockResolvedValue({
      _id: showId,
      seats: [{ x: 1, y: 1, status: SeatStatus.Reserved }],
      save: jest.fn(),
    });

    await releaseSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Success,
      message: messages.SEAT_RESERVED_NOW,
    });

    // Check if the seat status was updated to Available
    expect((await Show.findById(showId))!.seats[0].status).toBe(SeatStatus.Available);
  });

  test('should return failure if show is not found', async () => {
    (Show.findById as jest.Mock).mockResolvedValue(null);

    await releaseSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Failure,
      message: messages.RECORD_NOT_FOUND,
    });
  });

  test('should return failure if seat is not found', async () => {
    (Show.findById as jest.Mock).mockResolvedValue({
      _id: showId,
      seats: [],
    });

    await releaseSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Failure,
      message: messages.SEAT_NOT_FOUND,
    });
  });

  test('should handle errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (Show.findById as jest.Mock).mockRejectedValue(new Error('Database error'));
    await releaseSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });
    expect(consoleSpy).toHaveBeenCalled();

    (Show.findById as jest.Mock).mockRejectedValue({ message: 'error has occurred' });
    await releaseSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
