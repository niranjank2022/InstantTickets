import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { validateRequest } from '../../src/middleware/validate';
import { createBookingDto } from '../../src/dto/createBooking.dto';
import { BookingController } from '../../src/controllers/booking.controller';

jest.mock('../../src/controllers/booking.controller');

const app = express();
app.use(express.json());
app.post('/apis/bookings/', validateRequest(createBookingDto), BookingController.createBooking);

describe('POST /apis/bookings/', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass validation for valid data', async () => {
    const validData = { userId: 'user456', venueId: 'venue456', showId: 'showId', bookedSeats: ['seat123', 'seat456'] };

    (BookingController.createBooking as jest.Mock).mockImplementation((req, res) => {
      return res.status(201).json({
        bookingId: 'booking123',
        bookingTime: new Date().toISOString(),
      });
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
      bookedSeats: [],
    };

    const response = await request(app).post('/apis/bookings/').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].property).toBe('bookedSeats');
  });

  it('should fail validation for invalid data (empty strings in seats[])', async () => {
    const invalidData = {
      userId: new mongoose.Types.ObjectId().toString(),
      showId: new mongoose.Types.ObjectId().toString(),
      venueId: new mongoose.Types.ObjectId().toString(),
      bookedSeats: ['', 'seat123'],
    };

    const response = await request(app).post('/apis/bookings/').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].property).toBe('bookedSeats');
  });

  it('should fail validation for missing userId', async () => {
    const invalidData = {
      showId: 'show456',
      venueId: 'venue789',
      bookedSeats: ['seat789'],
    };

    const response = await request(app).post('/apis/bookings/').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].property).toBe('userId');
  });
});
