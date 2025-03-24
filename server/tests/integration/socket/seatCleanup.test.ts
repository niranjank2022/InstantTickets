import cron from 'node-cron';
import { startSeatCleanupJob } from '../../../src/socket/seatCleanup.job';
import { ShowService } from '../../../src/services/show.service';
import { getIo } from '../../../src/socket/socket';
import { SeatStatus } from '../../../src/config/enum';

jest.mock('node-cron');
jest.mock('../../../src/services/show.service');
jest.mock('../../../src/socket/socket');

describe('startSeatCleanupJob', () => {
  let mockEmit: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Ensure getIo().emit is properly mocked
    mockEmit = jest.fn();
    (getIo as jest.Mock).mockReturnValue({ emit: mockEmit });
  });

  test('should reset expired seats to Available', async () => {
    const mockShow = {
      _id: 'show123',
      seats: [
        { x: 1, y: 1, status: SeatStatus.Reserved, expirationTime: new Date(Date.now() - 60000) },
        { x: 1, y: 2, status: SeatStatus.Available, expirationTime: null },
      ],
      save: jest.fn(),
    };
    (ShowService.getShowsWithExpiredSeats as jest.Mock).mockResolvedValue([mockShow]);

    startSeatCleanupJob();

    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await cronCallback();

    expect(mockShow.seats[0].status).toBe(SeatStatus.Available);
    expect(mockShow.seats[0].expirationTime).toBeNull();
    expect(mockShow.save).toHaveBeenCalled();
    expect(mockEmit).toHaveBeenCalledWith('seatUpdate', {
      x: 1,
      y: 1,
      showId: 'show123',
      status: SeatStatus.Available,
    });
  });

  test('should not modify non-expired seats', async () => {
    const mockShow = {
      _id: 'show456',
      seats: [{ x: 2, y: 2, status: SeatStatus.Reserved, expirationTime: new Date(Date.now() + 60000) }],
      save: jest.fn(),
    };
    (ShowService.getShowsWithExpiredSeats as jest.Mock).mockResolvedValue([mockShow]);

    startSeatCleanupJob();

    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await cronCallback();

    expect(mockShow.seats[0].status).toBe(SeatStatus.Reserved);
    expect(mockShow.save).not.toHaveBeenCalled();
  });

  test('should handle no expired seats gracefully', async () => {
    (ShowService.getShowsWithExpiredSeats as jest.Mock).mockResolvedValue([]);

    startSeatCleanupJob();

    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await cronCallback();

    expect(mockEmit).not.toHaveBeenCalled();
  });

  test('should handle errors without crashing', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    (ShowService.getShowsWithExpiredSeats as jest.Mock).mockRejectedValue(new Error('DB Error'));

    startSeatCleanupJob();
    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];

    await expect(cronCallback()).resolves.not.toThrow();

    expect(mockConsoleError).toHaveBeenCalled();

    // Test another case with a different error type
    (ShowService.getShowsWithExpiredSeats as jest.Mock).mockRejectedValue({ message: 'error has occurred' });

    startSeatCleanupJob();
    const cronCallback2 = (cron.schedule as jest.Mock).mock.calls[1][1];

    await expect(cronCallback2()).resolves.not.toThrow();
    expect(mockConsoleError).toHaveBeenCalled();

    mockConsoleError.mockRestore();
  });

  test('should schedule cron job correctly', () => {
    startSeatCleanupJob();
    expect(cron.schedule).toHaveBeenCalledWith('* * * * *', expect.any(Function));
  });
});
