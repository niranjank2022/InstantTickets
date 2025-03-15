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

    (getIo as jest.Mock).mockReturnValue({
      emit: jest.fn(),
    });
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

    (Show.find as jest.Mock).mockResolvedValue([mockShow]);

    startSeatCleanupJob();

    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await cronCallback();

    expect(mockShow.seats[0].status).toBe(SeatStatus.Available);
    expect(mockShow.seats[0].expirationTime).toBeNull();
    expect(mockShow.save).toHaveBeenCalled();
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
      seats: [{ x: 2, y: 2, status: SeatStatus.Reserved, expirationTime: new Date(Date.now() + 60000) }],
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
    (Show.find as jest.Mock).mockResolvedValue([]);

    startSeatCleanupJob();

    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await cronCallback();

    expect(getIo().emit).not.toHaveBeenCalled();
  });

  test('should handle errors without crashing', async () => {
    let cronCallback;
    (Show.find as jest.Mock).mockRejectedValue(new Error('DB Error'));
    startSeatCleanupJob();
    cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await expect(cronCallback()).resolves.not.toThrow();

    (Show.find as jest.Mock).mockRejectedValue({ message: 'error has occurred' });
    startSeatCleanupJob();
    cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    await expect(cronCallback()).resolves.not.toThrow();
  });

  test('should schedule cron job correctly', () => {
    startSeatCleanupJob();
    expect(cron.schedule).toHaveBeenCalledWith('* * * * *', expect.any(Function));
  });
});
