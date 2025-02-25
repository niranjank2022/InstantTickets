import dotenv from "dotenv";

dotenv.config();

export const config = Object.freeze({
    MONGODB_URI: process.env.MONGODB_URI || "",
    PORT: process.env.PORT || 3000,
});
