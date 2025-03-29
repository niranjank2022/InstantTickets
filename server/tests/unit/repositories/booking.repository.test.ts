import { HydratedDocument } from 'mongoose';
import { IBooking, Booking } from '../../../src/models/booking.model';
import { BookingRepository } from '../../../src/repositories/booking.repository';
import Sample from '../../../seeds/sample';
import { messages } from '../../../src/config/logger';

jest.mock('../../../src/models/booking.model');

describe('BookingRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should find booking by ID', async () => {
    const mockBooking = Sample.bookings.find;
    (Booking.findById as jest.Mock).mockResolvedValue(mockBooking);

    const booking = await BookingRepository.findById(mockBooking._id);
    expect(booking).toEqual(mockBooking);
  });

  test('should throw error if some error happens', async () => {
    const mockBooking = Sample.bookings.find;
    (Booking.findById as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));
    await expect(BookingRepository.findById(mockBooking._id)).rejects.toThrow(
      messages.booking.FIND_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should create a single bookings', async () => {
    const booking = Sample.bookings.create;
    (Booking.create as jest.Mock).mockResolvedValue(booking);

    const result = await BookingRepository.create(booking as HydratedDocument<IBooking>);
    expect(result).toEqual(booking);
  });

  test('should throw error if some error happens', async () => {
    const booking = Sample.bookings.create;
    (Booking.create as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(BookingRepository.create(booking as HydratedDocument<IBooking>)).rejects.toThrow(
      messages.booking.CREATE_ERROR + messages.RANDOM_ERROR
    );
  });

  test('should delete bookings based on filter', async () => {
    (Booking.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });

    const result = await BookingRepository.deleteMany({});
    expect(result.deletedCount).toBe(2);
  });

  test('should throw error if some error happens', async () => {
    (Booking.deleteMany as jest.Mock).mockRejectedValue(new Error(messages.RANDOM_ERROR));

    await expect(BookingRepository.deleteMany({})).rejects.toThrow(
      messages.booking.DELETE_ERROR + messages.RANDOM_ERROR
    );
  });
});
