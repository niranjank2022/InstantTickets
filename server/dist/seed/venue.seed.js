'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator['throw'](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.venues = void 0;
exports.seedVenues = seedVenues;
const mongoose_1 = __importDefault(require('mongoose'));
require('dotenv/config');
const venue_model_1 = require('../models/venue.model');
const config_1 = require('../config/config');
const logger_1 = require('../config/logger');
// Sample Venues with Sections
exports.venues = [
    {
        name: 'Royal Theatre',
        location: '123 Main St',
        rows: 20,
        columns: 30,
        rowIndices: [...Array(20).keys()].map(i => String.fromCharCode(65 + i)), // A - T
        columnIndices: [...Array(30).keys()].map(i => (i + 1).toString()), // 1 - 30
        sections: [
            { name: 'VIP', x: 0, y: 0, rows: 5, columns: 10, price: 100 },
            { name: 'Premium', x: 5, y: 0, rows: 5, columns: 10, price: 75 },
            { name: 'Regular', x: 10, y: 0, rows: 10, columns: 10, price: 50 },
        ],
    },
    {
        name: 'Grand Arena',
        location: '456 Broadway',
        rows: 25,
        columns: 40,
        rowIndices: [...Array(25).keys()].map(i => String.fromCharCode(65 + i)), // A - Y
        columnIndices: [...Array(40).keys()].map(i => (i + 1).toString()), // 1 - 40
        sections: [
            { name: 'Balcony', x: 0, y: 0, rows: 5, columns: 15, price: 120 },
            { name: 'Standard', x: 5, y: 0, rows: 10, columns: 15, price: 80 },
            { name: 'Economy', x: 15, y: 0, rows: 10, columns: 10, price: 40 },
        ],
    },
];
function seedVenues() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.config.MONGODB_URI);
            console.log(logger_1.messages.MONGODB_CONNECTION_SUCCESS);
            // Clear existing venues
            yield venue_model_1.Venue.deleteMany({});
            console.log(logger_1.messages.CLEARED_RECORDS('Venues'));
            // Insert new venues
            yield venue_model_1.Venue.insertMany(exports.venues);
            console.log(logger_1.messages.SEED_SUCCESS('Venues'));
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
;
//# sourceMappingURL=venue.seed.js.map