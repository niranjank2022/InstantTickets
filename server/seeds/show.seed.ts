import 'dotenv/config';
import { ShowService } from '../src/services/show.service';
import { messages, logError } from '../src/config/logger';
import Sample from './sample';

export async function seedShows() {
  try {
    // Clear existing shows
    await ShowService.deleteAllShows();
    console.log(messages.CLEARED_RECORDS('Shows'));

    // Insert new shows
    await ShowService.addMultipleShows(Sample.shows);
    console.log(messages.SEED_SUCCESS('Shows'));
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}
