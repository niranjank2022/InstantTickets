import { HydratedDocument } from 'mongoose';
import { IBooking } from '../../../src/models/booking.model';
import { BookingService } from '../../../src/services/booking.service';
import { BookingRepository } from '../../../src/repositories/booking.repository';
import { messages } from '../../../src/config/logger';
import Sample from '../../../seeds/sample';

jest.mock('../../../src/repositories/booking.repository');

describe('BookingService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get booking by ID', async () => {
    const mockBooking = Sample.bookings.find;
    (BookingRepository.findById as jest.Mock).mockResolvedValue(mockBooking);

    const booking = await BookingService.getBookingById(mockBooking._id);
    expect(booking).toEqual(mockBooking);
  });

  test('should throw error if some error happens', async () => {
    const mockBooking = Sample.bookings.find;
    (BookingRepository.findById as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));
    await expect(BookingService.getBookingById(mockBooking._id)).rejects.toThrow(
      messages.booking.FIND_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should create single bookings', async () => {
    const booking = Sample.bookings.create;
    (BookingRepository.create as jest.Mock).mockResolvedValue(booking);

    const result = await BookingService.createBooking(booking as HydratedDocument<IBooking>);
    expect(result).toEqual(booking);
  });

  test('should throw error if some error happens', async () => {
    const booking = Sample.bookings.create;
    (BookingRepository.create as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(BookingService.createBooking(booking as HydratedDocument<IBooking>)).rejects.toThrow(
      messages.booking.CREATE_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should delete all bookings', async () => {
    (BookingRepository.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });

    const result = await BookingService.deleteAllBookings();
    expect(result.deletedCount).toBe(2);
  });

  test('should throw error if some error happens', async () => {
    (BookingRepository.deleteMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(BookingService.deleteAllBookings()).rejects.toThrow(
      messages.booking.DELETE_ERROR + messages.RANDOM_ERROR
    );
  });
});
