import { Request, Response } from 'express';
import { ShowService } from '../services/show.service';
import { logError, messages } from '../config/logger';

export const ShowController = {
  getShowById: async (req: Request, res: Response) => {
    try {
      const showId = req.params.showId.trim();
      const show = await ShowService.getShowById(showId);

      if (!show) {
        res.status(404).json({
          message: messages.RECORD_NOT_FOUND,
        });
        return;
      }

      res.status(200).json({
        showId: show!._id,
        venueId: show!.venueId,
        name: show!.name,
        startTime: show!.startTime,
        endTime: show!.endTime,
        seats: show!.seats,
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
