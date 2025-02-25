import mongoose, { Schema, Model } from "mongoose";
import { ISection } from "./sections";
import { ISeat, seatSchema } from "./seats";
import { SeatStatus } from "../config/enums";


interface IShowSeat extends ISeat {
    status: SeatStatus,
    expirationTime?: Date,
}

interface IShowSection extends ISection {
    price: Number,
    seats: IShowSeat[],
}

interface IShow extends Document {
    venueId: String,
    name: String,
    startTime: Date,
    endTime: Date,
    sections: IShowSection[],
}

const showSeatSchema = new Schema<IShowSeat>({
    status: {
        type: String,
        enum: Object.values(SeatStatus),
        default: SeatStatus.Available,
    },
    expirationTime: {
        type: Date || null,
    },
}).add(seatSchema);

const showSectionSchema = new Schema<IShowSection>({
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
    price: {
        type: Number,
        required: true,
    },
    seats: {
        type: [showSeatSchema],
        required: true,
    }
});

const showSchema: Schema = new Schema<IShow>({
    venueId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    sections: {
        type: [showSectionSchema],
        required: true,
    }
});

export const Show: Model<IShow> = mongoose.model<IShow>("Show", showSchema);
