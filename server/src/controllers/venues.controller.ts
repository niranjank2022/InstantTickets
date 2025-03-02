import { Request, Response } from "express";
import { Venue } from "../models/venues";
import { messages } from "../config/logger";


export async function getSectionsByVenue(req: Request, res: Response) {
    try {
        const venueId = req.params.venueId;
        const venue = await Venue.findById(venueId);

        if (!venue) {
            res.status(400).json({
                message: messages.RECORD_NOT_FOUND,
            });
            return;
        }

        res.status(200).json({
            venueId: venueId,
            sections: venue.sections,
        });

    } catch (error) {
        res.status(500).json({
            message: messages.SERVER_ERROR,
        });
    }
}
