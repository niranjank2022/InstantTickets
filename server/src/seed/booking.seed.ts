import mongoose from "mongoose";
import "dotenv/config";
import { Venue } from "../models/venue.model";
import { config } from "../config/config";


export async function seedBookings() {
    try {
        await mongoose.connect(config.MONGODB_URI!);
        console.log("Connected to MongoDB");

        // Clear existing shows
        await Venue.deleteMany({});
        console.log("Cleared existing bookings");
        mongoose.connection.close();

    } catch (error) {
        console.error("Error seeding shows:", error);
        mongoose.connection.close();
    }
}
