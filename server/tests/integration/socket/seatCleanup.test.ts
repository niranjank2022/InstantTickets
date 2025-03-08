import cron from 'node-cron';
import { startSeatCleanupJob } from '../../../src/socket/seatCleanup.job';
import { Show } from '../../../src/models/show.model';
import { getIo } from '../../../src/socket/socket';
import { SeatStatus } from '../../../src/config/enum';

jest.mock('node-cron');
jest.mock('../../../src/models/show.model');
jest.mock('../../../src/socket/socket');

describe('startSeatCleanupJob', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ Mock getIo to return an object with an `emit` function
    (getIo as jest.Mock).mockReturnValue({
      emit: jest.fn(),
    });
  });

  test('should reset expired seats to Available', async () => {
    const mockShow = {
      _id: 'show123',
      seats: [
        { x: 1, y: 1, status: SeatStatus.Reserved, expirationTime: new Date(Date.now() - 60000) }, // Expired
        { x: 1, y: 2, status: SeatStatus.Available, expirationTime: null }, // Already available
      ],
      save: jest.fn(),
    };

    (Show.find as jest.Mock).mockResolvedValue([mockShow]);

    startSeatCleanupJob();

    // Simulate cron execution
    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await cronCallback();

    // ✅ Expect expired seat to be reset to Available
    expect(mockShow.seats[0].status).toBe(SeatStatus.Available);
    expect(mockShow.seats[0].expirationTime).toBeNull();

    // ✅ Ensure database save is called
    expect(mockShow.save).toHaveBeenCalled();

    // ✅ Ensure socket event is emitted
    expect(getIo().emit).toHaveBeenCalledWith('seatUpdate', {
      x: 1,
      y: 1,
      showId: 'show123',
      status: SeatStatus.Available,
    });
  });

  test('should not modify non-expired seats', async () => {
    const mockShow = {
      _id: 'show456',
      seats: [
        { x: 2, y: 2, status: SeatStatus.Reserved, expirationTime: new Date(Date.now() + 60000) }, // Not expired yet
      ],
      save: jest.fn(),
    };

    (Show.find as jest.Mock).mockResolvedValue([mockShow]);

    startSeatCleanupJob();

    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await cronCallback();

    expect(mockShow.seats[0].status).toBe(SeatStatus.Reserved);
    expect(mockShow.save).not.toHaveBeenCalled();
  });

  test('should handle no expired seats gracefully', async () => {
    (Show.find as jest.Mock).mockResolvedValue([]); // No expired shows found

    startSeatCleanupJob();

    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await cronCallback();

    expect(getIo().emit).not.toHaveBeenCalled();
  });

  test('should handle errors without crashing', async () => {
    // Mock database failure
    (Show.find as jest.Mock).mockRejectedValue(new Error('DB Error'));

    startSeatCleanupJob();

    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];

    await expect(cronCallback()).resolves.not.toThrow(); // ✅ This should now pass
  });

  test('should schedule cron job correctly', () => {
    startSeatCleanupJob();
    expect(cron.schedule).toHaveBeenCalledWith('* * * * *', expect.any(Function));
  });
});
