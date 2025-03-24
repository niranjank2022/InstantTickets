import 'dotenv/config';
import { logError, messages } from '../config/logger';
import { VenueServices } from '../services/venue.service';
import Sample from './sample';

export async function seedVenues() {
  try {
    await VenueServices.deleteAllVenues();
    console.log(messages.CLEARED_RECORDS('Venues'));

    await VenueServices.addMultipleVenues(Sample.venues);
    console.log(messages.SEED_SUCCESS('Venues'));
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    } else {
      console.error(messages.UNKNOWN_ERROR);
    }
  }
}
