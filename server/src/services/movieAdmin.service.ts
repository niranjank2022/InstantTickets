import { IMovieAdmin } from '../models/movieAdmin.model';
import { MovieAdminRepository } from '../repositories/movieAdmin.repository';
import { messages } from '../config/logger';

export const MovieAdminService = {
  createMovieAdmin: async (movieAdmin: Partial<IMovieAdmin>) => {
    try {
      return await MovieAdminRepository.create(movieAdmin);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getMovieAdminByEmail: async (email: string) => {
    try {
      return await MovieAdminRepository.findOne({ email: email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  addMovieId: async (email: string, movieId: string) => {
    try {
      const movieAdmin = await MovieAdminRepository.findOne({ email: email });
      movieAdmin?.movies.push(movieId);
      movieAdmin?.save();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  doesMovieAdminExists: async (email: string) => {
    try {
      return !!(await MovieAdminRepository.exists({ email: email }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
