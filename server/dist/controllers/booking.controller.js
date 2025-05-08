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
Object.defineProperty(exports, '__esModule', { value: true });
exports.createBooking = createBooking;
const booking_model_1 = require('../models/booking.model');
const logger_1 = require('../config/logger');
function createBooking(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, showId, venueId, seats } = req.body;
            const booking = yield booking_model_1.Booking.create({
                userId: userId,
                showId: showId,
                venueId: venueId,
                bookingTime: new Date(),
                bookedSeats: seats,
            });
            yield booking.save();
            res.status(200).json({
                bookingId: booking._id,
                bookingTime: booking.bookingTime,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                (0, logger_1.logError)(error);
            }
            else {
                console.error(logger_1.messages.UNKNOWN_ERROR);
            }
            res.status(500).json({
                message: logger_1.messages.SERVER_ERROR,
            });
        }
    });
}
//# sourceMappingURL=booking.controller.js.map