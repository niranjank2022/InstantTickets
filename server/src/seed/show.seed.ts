import mongoose from "mongoose";
import "dotenv/config";
import { Show, ISeat } from "../models/show.model";
import { config } from "../config/config";
import { SeatStatus } from "../config/enum";


export async function seedShows() {
    try {
        await mongoose.connect(config.MONGODB_URI!);
        console.log("Connected to MongoDB");

        // Clear existing shows
        await Show.deleteMany({});
        console.log("Cleared existing shows");

        const sections = [
            [
                { x: 0, y: 0, rows: 5, columns: 10 },
                { x: 5, y: 0, rows: 5, columns: 10 },
                { x: 10, y: 0, rows: 10, columns: 10 },
            ],
            [
                { x: 0, y: 0, rows: 5, columns: 15 },
                { x: 5, y: 0, rows: 10, columns: 15 },
                { x: 15, y: 0, rows: 10, columns: 10 },
            ]
        ]

        // Define new shows with seats
        const shows = [
            {
                venueId: "67c454b4160ea4d6607d579c",
                name: "Avengers: Endgame",
                startTime: new Date("2024-03-01T18:00:00.000Z"),
                endTime: new Date("2024-03-01T21:00:00.000Z"),
                seats: generateSeats(sections[0]),
            },
            {
                venueId: "67c454b4160ea4d6607d579d",
                name: "Batman Begins",
                startTime: new Date("2024-03-02T20:00:00.000Z"),
                endTime: new Date("2024-03-02T23:00:00.000Z"),
                seats: generateSeats(sections[1]),
            }
        ];

        // Insert new shows
        await Show.insertMany(shows);
        console.log("Shows and seats seeded successfully!");
        mongoose.connection.close();

    } catch (error) {
        console.error("Error seeding shows:", error);
        mongoose.connection.close();
    }
};

function generateSeats(sections: { x: number; y: number; rows: number; columns: number; }[]) {
    const seats: ISeat[] = [];
    for (const { x, y, rows, columns } of sections) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                seats.push({
                    x: x + i,
                    y: y + j,
                    status: SeatStatus.Available
                });
            }
        }
    }

    return seats;
};
