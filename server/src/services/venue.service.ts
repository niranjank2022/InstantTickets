import { IVenue } from '../models/venue.model';
import { VenueRepository } from './../repositories/venue.repository';
import { TheatreAdminRepository } from '../repositories/theatreAdmin.repository';
import { messages } from '../config/logger';

export const VenueService = {
  createVenue: async (venue: Partial<IVenue>) => {
    try {
      return VenueRepository.create(venue);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getVenueById: async (venueId: string) => {
    try {
      return await VenueRepository.findOne({ _id: venueId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getVenuesByAdminEmail: async (adminEmail: string) => {
    try {
      const admin = await TheatreAdminRepository.findOne({ email: adminEmail });

      if (!admin) {
        return [];
      }

      const res = [];
      for (const venueId of admin!.venues) {
        const venue = await VenueRepository.findOne({ _id: venueId });
        res.push({
          venueId: venueId,
          name: venue?.name,
          city: venue?.city,
        });
      }
      return res;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  checkVenueExists: async (venueName: string, city: string): Promise<boolean> => {
    try {
      const venue = await VenueRepository.findOne({ name: venueName, city: city });
      return !!venue;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
