import mongoose, { Document, Schema } from "mongoose";


interface ISection {
    name: String;
    x: Number;
    y: Number;
    rows: Number;
    columns: Number;
    price: Number;
}

interface IVenue extends Document {
    name: String;
    location: String;
    rows: Number;
    columns: Number;
    rowIndices: String[];
    columnIndices: String[];
    sections: ISection[];
}

const sectionSchema = new Schema<ISection>(
    {
        name: {
            type: String,
            required: true,
        },
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
        rows: {
            type: Number,
            required: true
        },
        columns: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    },
    {
        _id: false,
    }
);

const venueSchema = new Schema<IVenue>({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rows: {
        type: Number,
        required: true,
    },
    columns: {
        type: Number,
        required: true,
    },
    rowIndices: {
        type: [String],
        required: true,
    },
    columnIndices: {
        type: [String],
        required: true,
    },
    sections: {
        type: [sectionSchema],
        required: true
    },
});

export const Venue = mongoose.model<IVenue>("Venue", venueSchema);
