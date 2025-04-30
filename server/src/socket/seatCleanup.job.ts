import cron from 'node-cron';
import { ShowService } from '../services/show.service';
import { getIo } from '../socket/socket';
import { logError, messages } from '../config/logger';
import { SeatStatus } from '../config/enum';

export function startSeatCleanupJob() {
  cron.schedule('* * * * *', async () => {
    try {
      console.log(messages.SEAT_CLEANUP_STARTED);
      const expiredShows = await ShowService.getShowsWithExpiredSeats();

      for (const show of expiredShows) {
        let updated = false;

        for (const seat of show.seats) {
          if (seat.expirationTime && new Date() > new Date(seat.expirationTime)) {
            seat.status = SeatStatus.Available;
            seat.expirationTime = null;
            updated = true;
            getIo().emit('seatUpdate', { x: seat.x, y: seat.y, showId: show.id, status: SeatStatus.Available });
          }
        }

        if (updated) {
          await show.save();
        }
      }
    } catch (error) {
      console.error(messages.SEAT_CLEANUP_ERROR);
      if (error instanceof Error) {
        logError(error);
      } else {
        console.error(messages.UNKNOWN_ERROR);
      }
    }
  });
}
