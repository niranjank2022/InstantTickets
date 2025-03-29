import mongoose from 'mongoose';
import { config } from '../src/config/config';
import { messages } from '../src/config/logger';
import { seedBookings } from './booking.seed';
import { seedShows } from './show.seed';
import { seedVenues } from './venue.seed';

async function runAllSeeds() {
  await mongoose.connect(config.MONGODB_URI!);
  console.log(messages.MONGODB_CONNECTION_SUCCESS);

  console.log(messages.SEEDS_RUNNING);
  await seedVenues();
  await seedShows();
  await seedBookings();
  console.log(messages.SEEDS_COMPLETED);

  await mongoose.connection.close();
}

(async () => {
  await runAllSeeds();
})();
