import { Schema, Document } from "mongoose";
import { ISeat, seatSchema } from "./seats";


export interface ISection extends Document {
    name: String,
    rows: Number,
    columns: Number,
    seats: ISeat[],
}

export const sectionSchema = new Schema<ISection>({
    name: {
        type: String,
        required: true,
    },
    rows: {
        type: Number,
        required: true
    },
    columns: {
        type: Number,
        required: true
    },
    seats: {
        type: [seatSchema],
        required: true
    },
});
