import { Request, Response } from "express";
import { Show } from "../models/shows";
import { messages } from "../config/logger";


export async function getShowById(req: Request, res: Response) {

    try {
        const showId = req.params.showId;
        const show = await Show.findById(showId);

        if (!show) {
            res.status(400).json({
                message: messages.RECORD_NOT_FOUND,
            });
            return;
        }

        res.status(200).json(show);

    } catch (error) {
        res.status(500).json({
            message: messages.SERVER_ERROR,
        });
    }
}
