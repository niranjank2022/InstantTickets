import 'dotenv/config';
import { logError, messages } from '../config/logger';
import { Booking } from '../models/booking.model';

export async function seedBookings() {
  try {
    await Booking.deleteMany({});
    console.log(messages.CLEARED_RECORDS('Bookings'));
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}
