import mongoose from "mongoose";
import "dotenv/config";
import { Venue } from "../models/venue.model";
import { config } from "../config/config";
import { logError, messages } from "../config/logger";


export async function seedBookings() {
    try {
        await mongoose.connect(config.MONGODB_URI!);
        console.log(messages.MONGODB_CONNECTION_SUCCESS);

        // Clear existing shows
        await Venue.deleteMany({});
        console.log(messages.CLEARED_RECORDS("Bookings"));
        mongoose.connection.close();

    } catch (error) {
        if (error instanceof Error) {
            logError(error);
        } else {
            console.error(messages.UNKNOWN_ERROR);
        }
        mongoose.connection.close();
    }
}
