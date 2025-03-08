import mongoose from 'mongoose';
import request from 'supertest';
import app from './../../../src/app';
import { Show } from '../../../src/models/show.model';
import { SeatStatus } from '../../../src/config/enum';

jest.mock('../../../src/models/show.model'); // Mock `Show` model

describe('Shows API', () => {
  const showId = new mongoose.Types.ObjectId().toString();
  const venueId = new mongoose.Types.ObjectId().toString();

  beforeAll(() => {
    (Show.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
    (Show.create as jest.Mock).mockResolvedValue({
      _id: showId,
      venueId: venueId,
      name: 'Maaveeran',
      startTime: new Date('2024-03-01T18:00:00.000Z'),
      endTime: new Date('2024-03-01T21:00:00.000Z'),
      seats: Array.from({ length: 100 }, (_, i) => ({
        x: Math.floor(i / 10),
        y: i % 10,
        status: SeatStatus.Available,
      })),
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return 404 if show is not found', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    (Show.findById as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).get(`/apis/shows/${fakeId}`);
    expect(response.status).toBe(404);
  });

  it('returns status code 200 if show found', async () => {
    (Show.findById as jest.Mock).mockResolvedValue({
      _id: showId,
      venueId: venueId,
      name: 'Maaveeran',
      startTime: new Date('2024-03-01T18:00:00.000Z'),
      endTime: new Date('2024-03-01T21:00:00.000Z'),
      seats: Array.from({ length: 100 }, (_, i) => ({
        x: Math.floor(i / 10),
        y: i % 10,
        status: SeatStatus.Available,
      })),
    });
    const res = await request(app).get(`/apis/shows/${showId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('showId', showId);
    expect(res.body.name).toBe('Maaveeran');
  });

  it('should return 500 if server error occurs', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      let res;
      (Show.findById as jest.Mock).mockRejectedValue(new Error('Server Error'));
      res = await request(app).get(`/apis/shows/${showId}`);
      expect(res.status).toBe(500);
      expect(consoleSpy).toHaveBeenCalledTimes(2);

      (Show.findById as jest.Mock).mockRejectedValue({ message: 'Error occurred' });
      res = await request(app).get(`/apis/shows/${showId}`);
      expect(res.status).toBe(500);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
});
