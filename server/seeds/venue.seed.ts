import 'dotenv/config';
import { logError, messages } from '../src/config/logger';
import { VenueService } from '../src/services/venue.service';
import Sample from './sample';

export async function seedVenues() {
  try {
    await VenueService.deleteAllVenues();
    console.log(messages.CLEARED_RECORDS('Venues'));

    await VenueService.addMultipleVenues(Sample.venues);
    console.log(messages.SEED_SUCCESS('Venues'));
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}
