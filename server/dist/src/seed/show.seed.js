"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedShows = seedShows;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const show_model_1 = require("../models/show.model");
const config_1 = require("../config/config");
const enum_1 = require("../config/enum");
const logger_1 = require("../config/logger");
function seedShows() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.config.MONGODB_URI);
            console.log(logger_1.messages.MONGODB_CONNECTION_SUCCESS);
            // Clear existing shows
            yield show_model_1.Show.deleteMany({});
            console.log(logger_1.messages.CLEARED_RECORDS('Shows'));
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
                ],
            ];
            // Define new shows with seats
            const shows = [
                {
                    venueId: '67c454b4160ea4d6607d579c',
                    name: 'Avengers: Endgame',
                    startTime: new Date('2024-03-01T18:00:00.000Z'),
                    endTime: new Date('2024-03-01T21:00:00.000Z'),
                    seats: generateSeats(sections[0]),
                },
                {
                    venueId: '67c454b4160ea4d6607d579d',
                    name: 'Batman Begins',
                    startTime: new Date('2024-03-02T20:00:00.000Z'),
                    endTime: new Date('2024-03-02T23:00:00.000Z'),
                    seats: generateSeats(sections[1]),
                },
            ];
            // Insert new shows
            yield show_model_1.Show.insertMany(shows);
            console.log(logger_1.messages.SEED_SUCCESS('Shows'));
            mongoose_1.default.connection.close();
        }
        catch (error) {
            if (error instanceof Error) {
                (0, logger_1.logError)(error);
            }
            else {
                console.error(logger_1.messages.UNKNOWN_ERROR);
            }
            mongoose_1.default.connection.close();
        }
    });
}
function generateSeats(sections) {
    const seats = [];
    for (const { x, y, rows, columns } of sections) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                seats.push({
                    x: x + i,
                    y: y + j,
                    status: enum_1.SeatStatus.Available,
                    expirationTime: null,
                });
            }
        }
    }
    return seats;
}
//# sourceMappingURL=show.seed.js.map