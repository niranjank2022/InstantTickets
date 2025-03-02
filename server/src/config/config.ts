import dotenv from "dotenv";

dotenv.config();

export const config = Object.freeze({
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://niranjankdesktop:iamadmin@clustermain.v0nwe.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMain",
    PORT: process.env.PORT || 3000,
});
