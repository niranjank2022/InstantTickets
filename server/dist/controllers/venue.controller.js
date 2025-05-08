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
exports.getVenueById = getVenueById;
const venue_model_1 = require('../models/venue.model');
const logger_1 = require('../config/logger');
function getVenueById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const venueId = req.params.venueId;
            const venue = yield venue_model_1.Venue.findById(venueId);
            if (venue === undefined) {
                res.status(400).json({
                    message: logger_1.messages.RECORD_NOT_FOUND,
                });
                return;
            }
            res.status(200).json({
                venueId: venue === null || venue === void 0 ? void 0 : venue._id,
                name: venue === null || venue === void 0 ? void 0 : venue.name,
                location: venue === null || venue === void 0 ? void 0 : venue.location,
                rows: venue === null || venue === void 0 ? void 0 : venue.rows,
                cols: venue === null || venue === void 0 ? void 0 : venue.columns,
                rowIndices: venue === null || venue === void 0 ? void 0 : venue.rowIndices,
                columnIndices: venue === null || venue === void 0 ? void 0 : venue.columnIndices,
                sections: venue === null || venue === void 0 ? void 0 : venue.sections
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
//# sourceMappingURL=venue.controller.js.map