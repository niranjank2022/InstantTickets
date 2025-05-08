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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShowById = getShowById;
const show_model_1 = require("../models/show.model");
const logger_1 = require("../config/logger");
function getShowById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const showId = req.params.showId;
            const show = yield show_model_1.Show.findById(showId);
            if (show === undefined) {
                res.status(404).json({
                    message: logger_1.messages.RECORD_NOT_FOUND,
                });
                return;
            }
            res.status(200).json({
                showId: show._id,
                venueId: show.venueId,
                name: show.name,
                startTime: show.startTime,
                endTime: show.endTime,
                seats: show.seats,
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
//# sourceMappingURL=show.controller.js.map