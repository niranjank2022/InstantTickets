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
exports.seedBookings = seedBookings;
const mongoose_1 = __importDefault(require('mongoose'));
require('dotenv/config');
const venue_model_1 = require('../models/venue.model');
const config_1 = require('../config/config');
const logger_1 = require('../config/logger');
function seedBookings() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.config.MONGODB_URI);
            console.log(logger_1.messages.MONGODB_CONNECTION_SUCCESS);
            // Clear existing shows
            yield venue_model_1.Venue.deleteMany({});
            console.log(logger_1.messages.CLEARED_RECORDS('Bookings'));
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
//# sourceMappingURL=booking.seed.js.map