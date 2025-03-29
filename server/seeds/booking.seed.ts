import 'dotenv/config';
import { logError, messages } from '../src/config/logger';
import { BookingService } from '../src/services/booking.service';

export async function seedBookings() {
  try {
    await BookingService.deleteAllBookings();
    console.log(messages.CLEARED_RECORDS('Bookings'));
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}
