import { Show, IShow } from '../models/show.model';
import { messages } from '../config/logger';
import { FilterQuery } from 'mongoose';

export const ShowRepository = {
  findById: async (id: string): Promise<IShow | null> => {
    try {
      return await Show.findById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.show.FIND_ERROR + errorMessage);
    }
  },

  insertMany: async (shows: IShow[]) => {
    try {
      return await Show.insertMany(shows);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.show.INSERT_ERROR + errorMessage);
    }
  },

  deleteMany: async (filter: Partial<IShow>) => {
    try {
      return await Show.deleteMany(filter as FilterQuery<IShow>);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.show.DELETE_ERROR + errorMessage);
    }
  },

  find: async (param1: string, param2: any) => {
    try {
      const filter: { [key: string]: string } = {};
      filter[param1] = param2;
      return await Show.find(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.show.FIND_ERROR + errorMessage);
    }
  },
};
