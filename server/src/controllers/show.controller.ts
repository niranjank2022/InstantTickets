import { Request, Response } from "express";
import { Show } from "../models/show.model";
import { messages } from "../config/logger";


export async function getShowById(req: Request, res: Response) {

    try {
        const showId = req.params.showId;
        const show = await Show.findById(showId);

        if (show === undefined) {
            res.status(400).json({
                message: messages.RECORD_NOT_FOUND,
            });
            return;
        }

        res.status(200).json({
            showId: show?._id,
            venueId: show?.venueId,
            name: show?.name,
            startTime: show?.startTime,
            endTime: show?.endTime,
            seats: show?.seats,
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error message: ", error.message);
            console.error("Error Stack Trace: ", error.stack);
        } else {
            console.error("Unknown error");
        }
        
        res.status(500).json({
            message: messages.SERVER_ERROR,
        });
    }
}
