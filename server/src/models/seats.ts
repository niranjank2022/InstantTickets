import { Document, Schema } from "mongoose";


export interface ISeat extends Document {
    seatNo: String,
}

export const seatSchema = new Schema<ISeat>({
    seatNo: {
        type: String,
        required: true
    }
});
