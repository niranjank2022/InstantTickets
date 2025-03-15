import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket as ServerSocket } from 'socket.io';
import { confirmSeatController } from '../../../src/socket/socket.controller';
import { Show } from '../../../src/models/show.model';
import { SeatStatus, SocketStatus } from '../../../src/config/enum';
import { messages } from '../../../src/config/logger';

jest.mock('../../../src/models/show.model');

describe('confirmSeatController', () => {
  let io: SocketServer;
  let httpServer: HttpServer;
  let mockSocket: Partial<ServerSocket>;
  const showId = 'testShowId';

  beforeAll(() => {
    httpServer = new HttpServer();
    io = new SocketServer(httpServer);
  });

  beforeEach(() => {
    mockSocket = {
      emit: jest.fn(),
    } as Partial<ServerSocket>;

    jest.clearAllMocks();
  });

  afterAll(() => {
    io.close();
    httpServer.close();
  });

  test('should book a reserved seat', async () => {
    (Show.findById as jest.Mock).mockResolvedValue({
      _id: showId,
      seats: [{ x: 1, y: 1, status: SeatStatus.Reserved }],
      save: jest.fn(),
    });

    await confirmSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Success,
      message: messages.SEAT_BOOKED_NOW,
    });

    expect((await Show.findById(showId))!.seats[0].status).toBe(SeatStatus.Booked);
  });

  test('should return failure if show is not found', async () => {
    (Show.findById as jest.Mock).mockResolvedValue(null);

    await confirmSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

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

    await confirmSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Failure,
      message: messages.SEAT_NOT_FOUND,
    });
  });

  test('should return failure if seat is not reserved', async () => {
    (Show.findById as jest.Mock).mockResolvedValue({
      _id: showId,
      seats: [{ x: 1, y: 1, status: SeatStatus.Available }],
    });

    await confirmSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Failure,
      message: messages.SEAT_CANNOT_BOOK,
    });
  });

  test('should handle errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (Show.findById as jest.Mock).mockRejectedValue(new Error('Database error'));
    await confirmSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });
    expect(consoleSpy).toHaveBeenCalled();

    (Show.findById as jest.Mock).mockRejectedValue({ message: 'error has occurred' });
    await confirmSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
