import { IShow } from '../models/show.model';
import { ShowRepository } from '../repositories/show.repository';
import { messages } from '../config/logger';

export const ShowService = {
  getShowById: async (showId: string) => {
    try {
      return await ShowRepository.findById(showId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.show.FIND_ERROR + errorMessage);
    }
  },

  addMultipleShows: async (shows: Partial<IShow>[]) => {
    try {
      return await ShowRepository.insertMany(shows);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.show.INSERT_ERROR + errorMessage);
    }
  },

  deleteAllShows: async () => {
    try {
      return await ShowRepository.deleteMany({});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.show.DELETE_ERROR + errorMessage);
    }
  },

  getShowsWithExpiredSeats: async () => {
    try {
      return await ShowRepository.find('seats.expirationTime', new Date());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.show.FIND_ERROR + errorMessage);
    }
  },
};
