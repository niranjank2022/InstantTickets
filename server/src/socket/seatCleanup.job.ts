import cron from 'node-cron';
import { Show } from '../models/show.model';
import { getIo } from '../socket/socket';
import { messages } from '../config/logger';
import { SeatStatus } from '../config/enum';

export function startSeatCleanupJob() {
  cron.schedule('* * * * *', async () => {
    try {
      console.log(messages.SEAT_CLEANUP_STARTED);

      const expiredShows = await Show.find({ 'seats.expirationTime': { $lt: new Date() } });

      for (const show of expiredShows) {
        let updated = false;

        for (const seat of show.seats) {
          if (seat.expirationTime && new Date() > new Date(seat.expirationTime)) {
            seat.status = SeatStatus.Available;
            seat.expirationTime = null;
            updated = true;
            getIo().emit('seatUpdate', { x: seat.x, y: seat.y, showId: show._id, status: SeatStatus.Available });
          }
        }

        if (updated) {
          await show.save();
        }
      }
    } catch (error) {
      console.error('Error in seat cleanup job:', error);
    }
  });
}
