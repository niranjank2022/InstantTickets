import request from 'supertest';
import app from './../../../src/app';
import { BookingService } from '../../../src/services/booking.service';
import Sample from '../../../seeds/sample';

jest.mock('../../../src/services/booking.service');

describe('Bookings API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a booking', async () => {
    const mockBooking = Sample.bookings.create;
    (BookingService.createBooking as jest.Mock).mockResolvedValue(mockBooking);

    const res = await request(app).post('/apis/bookings/').send(mockBooking);
    expect(res.statusCode).toBe(201);
  });

  it('should return 500 if server error occurs', async () => {
    const mockBooking = Sample.bookings.create;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (BookingService.createBooking as jest.Mock).mockRejectedValue(new Error('DB Error'));
    let res = await request(app).post('/apis/bookings/').send(mockBooking);
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalledTimes(2);

    (BookingService.createBooking as jest.Mock).mockRejectedValue({ message: 'error has occurred' });
    res = await request(app).post('/apis/bookings/').send(mockBooking);
    expect(res.status).toBe(500);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
