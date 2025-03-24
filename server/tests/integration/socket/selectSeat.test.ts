import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket as ServerSocket } from 'socket.io';
import { selectSeatController } from '../../../src/socket/socket.controller';
import { ShowService } from '../../../src/services/show.service';
import { SeatStatus, SocketStatus } from '../../../src/config/enum';
import { messages } from '../../../src/config/logger';

jest.mock('../../../src/services/show.service');

describe('selectSeatController', () => {
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

  test('should reserve an available seat', async () => {
    (ShowService.getShowById as jest.Mock).mockResolvedValue({
      _id: showId,
      seats: [{ x: 1, y: 1, status: SeatStatus.Available }],
      save: jest.fn(),
    });

    await selectSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Success,
      message: messages.SEAT_RESERVED_NOW,
    });
  });

  test('should return failure if show is not found', async () => {
    (ShowService.getShowById as jest.Mock).mockResolvedValue(null);

    await selectSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Failure,
      message: messages.RECORD_NOT_FOUND,
    });
  });

  test('should return failure if seat is not found', async () => {
    (ShowService.getShowById as jest.Mock).mockResolvedValue({
      _id: showId,
      seats: [],
    });

    await selectSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Failure,
      message: messages.SEAT_NOT_FOUND,
    });
  });

  test('should return failure if seat is already reserved', async () => {
    (ShowService.getShowById as jest.Mock).mockResolvedValue({
      _id: showId,
      seats: [{ x: 1, y: 1, status: SeatStatus.Reserved }],
    });

    await selectSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });

    expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
      status: SocketStatus.Failure,
      message: messages.SEAT_ALREADY_RESERVED,
    });
  });

  test('should handle errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (ShowService.getShowById as jest.Mock).mockRejectedValue(new Error('Database error'));
    await selectSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });
    expect(consoleSpy).toHaveBeenCalled();

    (ShowService.getShowById as jest.Mock).mockRejectedValue({ message: 'error has occurred' });
    await selectSeatController(mockSocket as ServerSocket, { showId, x: 1, y: 1 });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
