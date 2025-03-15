import mongoose from 'mongoose';
import request from 'supertest';
import app from './../../../src/app';
import { Venue } from '../../../src/models/venue.model';

jest.mock('../../../src/models/venue.model');

describe('Venues API', () => {
  const venueId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    (Venue.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 0 });
    (Venue.create as jest.Mock).mockResolvedValue({
      _id: venueId,
      name: 'Royal Theatre',
      location: '123 Main St',
      rows: 20,
      columns: 30,
      rowIndices: [...Array(20).keys()].map(i => String.fromCharCode(65 + i)), // A - T
      columnIndices: [...Array(30).keys()].map(i => (i + 1).toString()), // 1 - 30
      sections: [
        { name: 'VIP', x: 0, y: 0, rows: 5, columns: 10, price: 100 },
        { name: 'Premium', x: 5, y: 0, rows: 5, columns: 10, price: 75 },
        { name: 'Regular', x: 10, y: 0, rows: 10, columns: 10, price: 50 },
      ],
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('return status code 404 if venue not found', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    (Venue.findById as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).get(`/apis/venues/${fakeId}`);
    expect(response.status).toBe(404);
  });

  it('return status code 200 if venue found', async () => {
    (Venue.findById as jest.Mock).mockResolvedValue({
      _id: venueId,
      name: 'Royal Theatre',
      location: '123 Main St',
      rows: 20,
      columns: 30,
      rowIndices: [...Array(20).keys()].map(i => String.fromCharCode(65 + i)),
      columnIndices: [...Array(30).keys()].map(i => (i + 1).toString()),
      sections: [
        { name: 'VIP', x: 0, y: 0, rows: 5, columns: 10, price: 100 },
        { name: 'Premium', x: 5, y: 0, rows: 5, columns: 10, price: 75 },
        { name: 'Regular', x: 10, y: 0, rows: 10, columns: 10, price: 50 },
      ],
    });

    const res = await request(app).get('/apis/venues/' + venueId);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('venueId', venueId);
    expect(res.body.name).toBe('Royal Theatre');
  });

  it('should return 500 if server error occurs', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    let res;

    (Venue.findById as jest.Mock).mockRejectedValue(new Error('DB Error'));
    res = await request(app).get(`/apis/venues/${venueId}`);
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalledTimes(2);

    (Venue.findById as jest.Mock).mockRejectedValue({ message: 'error has occurred' });
    res = await request(app).get(`/apis/venues/${venueId}`);
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
