import mongoose, { Document, Schema } from "mongoose";
import { ISection, sectionSchema } from "./sections";


interface IVenue extends Document {
    name: String,
    location: String,
    sections: ISection[],
}

const venueSchema = new Schema<IVenue>({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    sections: {
        type: [sectionSchema],
        required: true
    },
});

export const Venue = mongoose.model<IVenue>("Venue", venueSchema);
