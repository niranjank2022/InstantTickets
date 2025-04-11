import { FilterQuery } from 'mongoose';
import { Venue, IVenue } from '../models/venue.model';
import { messages } from '../config/logger';

export const VenueRepository = {
  create: async (venue: Partial<IVenue>) => {
    try {
      return Venue.create(venue);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  findOne: async (venue: FilterQuery<IVenue>) => {
    try {
      return await Venue.findOne(venue);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
