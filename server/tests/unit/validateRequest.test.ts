import request from 'supertest';
import express from 'express';
import { validateRequest } from '../../src/middleware/validate';
import { createBookingDto } from '../../src/dto/createBooking.dto';
import { createBooking } from '../../src/controllers/booking.controller';
import { Booking } from '../../src/models/booking.model';
import mongoose from 'mongoose';

jest.mock('../../src/models/booking.model', () => ({
  Booking: {
    create: jest.fn(),
    findById: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.post('/apis/bookings/', validateRequest(createBookingDto), createBooking);

describe('POST /apis/bookings/', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass validation for valid data', async () => {
    const validData = {
      userId: new mongoose.Types.ObjectId().toString(),
      showId: new mongoose.Types.ObjectId().toString(),
      venueId: new mongoose.Types.ObjectId().toString(),
      seats: [new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString()],
    };

    (Booking.create as jest.Mock).mockResolvedValue({
      _id: 'mockBookingId',
      bookingTime: new Date().toISOString(),
      ...validData,
    });

    const response = await request(app).post('/apis/bookings/').send(validData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('bookingId');
    expect(response.body).toHaveProperty('bookingTime');
  });

  it('should fail validation for invalid data (empty seats[])', async () => {
    const invalidData = {
      userId: new mongoose.Types.ObjectId().toString(),
      showId: new mongoose.Types.ObjectId().toString(),
      venueId: new mongoose.Types.ObjectId().toString(),
      seats: [],
    };

    const response = await request(app).post('/apis/bookings/').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].property).toBe('seats');
  });

  it('should fail validation for invalid data (empty strings in seats[])', async () => {
    const invalidData = {
      userId: new mongoose.Types.ObjectId().toString(),
      showId: new mongoose.Types.ObjectId().toString(),
      venueId: new mongoose.Types.ObjectId().toString(),
      seats: ['', 'seat123'],
    };

    const response = await request(app).post('/apis/bookings/').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].property).toBe('seats');
  });

  it('should fail validation for missing userId', async () => {
    const invalidData = {
      showId: 'show456',
      venueId: 'venue789',
      seats: ['seat789'],
    };

    const response = await request(app).post('/apis/bookings/').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].property).toBe('userId');
  });

  it('should return 500 if database operation fails', async () => {
    const validData = {
      userId: 'user123',
      showId: 'show456',
      venueId: 'venue789',
      seats: ['seat789', 'seat101'],
    };

    (Booking.create as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await request(app).post('/apis/bookings/').send(validData);
    expect(response.status).toBe(500);
  });
});
