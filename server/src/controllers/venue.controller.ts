import { Request, Response } from 'express';
import { Venue } from '../models/venue.model';
import { logError, messages } from '../config/logger';

export async function getVenueById(req: Request, res: Response) {
  try {
    const venueId = req.params.venueId;
    const venue = await Venue.findById(venueId);

    if (venue === undefined) {
      res.status(400).json({
        message: messages.RECORD_NOT_FOUND,
      });
      return;
    }

    res.status(200).json({
      venueId: venue?._id,
      name: venue?.name,
      location: venue?.location,
      rows: venue?.rows,
      cols: venue?.columns,
      rowIndices: venue?.rowIndices,
      columnIndices: venue?.columnIndices,
      sections: venue?.sections,
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
}
