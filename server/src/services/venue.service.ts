import { IVenue } from '../models/venue.model';
import { VenueRepository } from './../repositories/venue.repository';
import { messages } from '../config/logger';

export const VenueService = {
  getVenueById: async (venueId: string) => {
    try {
      return await VenueRepository.findById(venueId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.venue.FIND_ERROR + errorMessage);
    }
  },

  addMultipleVenues: async (venues: IVenue[]) => {
    try {
      return await VenueRepository.insertMany(venues);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.venue.INSERT_ERROR + errorMessage);
    }
  },

  deleteAllVenues: async () => {
    try {
      return await VenueRepository.deleteMany({});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.venue.DELETE_ERROR + errorMessage);
    }
  },
};
