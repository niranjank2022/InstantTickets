import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { logError, messages } from '../config/logger';
import { VenueService } from '../services/venue.service';
import { config } from '../config/config';

export const VenueController = {
  getVenueById: async (req: Request, res: Response) => {
    try {
      const venueId = req.params.venueId.trim();
      const venue = await VenueService.getVenueById(venueId);

      if (!venue) {
        res.status(404).json({
          message: messages.RECORD_NOT_FOUND,
        });
        return;
      }

      res.status(200).json({
        venueId: venue!._id,
        name: venue!.name,
        city: venue!.city,
        rows: venue!.rows,
        columns: venue!.columns,
        rowIndices: venue!.rowIndices,
        columnIndices: venue!.columnIndices,
        sections: venue!.sections,
      });
    } catch (error) {
      if (error instanceof Error) {
        logError(error);
      } else {
        console.error(messages.UNKNOWN_ERROR);
      }

      res.status(500).json({
        message: messages.SERVER_ERROR,
      });
    }
  },

  getVenuesByAdminEmail: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({ message: 'Unauthorized access denied!' });
        return;
      }
      const { email } = jwt.verify(token, config.JWT_SECRET_KEY!) as { email: string; password: string };
      const venues = await VenueService.getVenuesByAdminEmail(email);
      res.status(200).json({
        venues: venues,
      });
    } catch (error) {
      if (error instanceof Error) {
        logError(error);
      } else {
        console.error(messages.UNKNOWN_ERROR);
      }

      res.status(500).json({
        message: messages.SERVER_ERROR,
      });
    }
  },
};
