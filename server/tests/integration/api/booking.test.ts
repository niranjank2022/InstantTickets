import request from 'supertest';
import app from './../../../src/app';
import mongoose from 'mongoose';
import { Booking } from '../../../src/models/booking.model';

jest.mock('../../../src/models/booking.model');

describe('Bookings API', () => {
  const mockBooking = {
    _id: new mongoose.Types.ObjectId().toString(),
    userId: new mongoose.Types.ObjectId().toString(),
    showId: new mongoose.Types.ObjectId().toString(),
    venueId: new mongoose.Types.ObjectId().toString(),
    seats: [new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString()],
    save: jest.fn(),
  };

  beforeAll(() => {
    (Booking.create as jest.Mock).mockResolvedValue(mockBooking);
    (Booking.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should create a booking', async () => {
    const res = await request(app).post('/apis/bookings/').send({
      userId: mockBooking.userId,
      showId: mockBooking.showId,
      venueId: mockBooking.venueId,
      seats: mockBooking.seats,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('bookingId', mockBooking._id);
  });

  it('should return 500 if server error occurs', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    let res;

    (Booking.create as jest.Mock).mockRejectedValue(new Error('DB Error'));
    res = await request(app).post('/apis/bookings/').send({
      userId: mockBooking.userId,
      showId: mockBooking.showId,
      venueId: mockBooking.venueId,
      seats: mockBooking.seats,
    });
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalledTimes(2);

    (Booking.create as jest.Mock).mockRejectedValue({ message: 'error has occurred' });
    res = await request(app).post('/apis/bookings/').send({
      userId: mockBooking.userId,
      showId: mockBooking.showId,
      venueId: mockBooking.venueId,
      seats: mockBooking.seats,
    });
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
