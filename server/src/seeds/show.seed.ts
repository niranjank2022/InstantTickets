import 'dotenv/config';
import { Show } from '../models/show.model';
import { messages, logError } from '../config/logger';
import Sample from './sample';

export async function seedShows() {
  try {
    // Clear existing shows
    await Show.deleteMany({});
    console.log(messages.CLEARED_RECORDS('Shows'));

    // Insert new shows
    const shows = Sample.shows;
    await Show.insertMany(shows);
    console.log(messages.SEED_SUCCESS('Shows'));
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}
