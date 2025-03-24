import { Request, Response } from 'express';
import { logError, messages } from '../config/logger';
import { VenueService } from '../services/venue.service';

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
        location: venue!.location,
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
};
