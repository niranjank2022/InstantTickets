import { Venue, IVenue } from '../models/venue.model';
import { messages } from '../config/logger';
import { FilterQuery } from 'mongoose';

export const VenueRepository = {
  findById: async (id: string): Promise<IVenue | null> => {
    try {
      return await Venue.findById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.venue.FIND_ERROR + errorMessage);
    }
  },

  insertMany: async (venues: IVenue[]) => {
    try {
      return await Venue.insertMany(venues);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.venue.INSERT_ERROR + errorMessage);
    }
  },

  deleteMany: async (filter: Partial<IVenue>) => {
    try {
      return await Venue.deleteMany(filter as FilterQuery<IVenue>);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.venue.DELETE_ERROR + errorMessage);
    }
  },
};
