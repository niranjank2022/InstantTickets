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
exports.selectSeatController = selectSeatController;
exports.releaseSeatController = releaseSeatController;
exports.confirmSeatController = confirmSeatController;
const socket_1 = require("./socket");
const show_model_1 = require("../models/show.model");
const enum_1 = require("../config/enum");
const logger_1 = require("../config/logger");
function selectSeatController(socket, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { showId, x, y } = data;
            const show = yield show_model_1.Show.findById(showId);
            if (!show) {
                console.error(logger_1.messages.RECORD_NOT_FOUND);
                return socket.emit('seatResponse', {
                    status: enum_1.SocketStatus.Failure,
                    message: logger_1.messages.RECORD_NOT_FOUND,
                });
            }
            const seat = show.seats.find(seat => seat.x === x && seat.y === y);
            if (seat === undefined) {
                console.error(logger_1.messages.RECORD_NOT_FOUND);
                return socket.emit('seatResponse', {
                    status: enum_1.SocketStatus.Failure,
                    message: logger_1.messages.SEAT_NOT_FOUND,
                });
            }
            if (seat.status === enum_1.SeatStatus.Reserved) {
                return socket.emit('seatResponse', {
                    status: enum_1.SocketStatus.Failure,
                    message: logger_1.messages.SEAT_ALREADY_RESERVED,
                });
            }
            seat.status = enum_1.SeatStatus.Reserved;
            show.save();
            socket.emit('seatResponse', {
                status: enum_1.SocketStatus.Success,
                message: logger_1.messages.SEAT_RESERVED_NOW,
            });
            (0, socket_1.getIo)().emit('seatUpdate', Object.assign(Object.assign({}, data), { seatStatus: seat.status }));
        }
        catch (error) {
            if (error instanceof Error) {
                (0, logger_1.logError)(error);
            }
            else {
                console.error(logger_1.messages.UNKNOWN_ERROR);
            }
        }
    });
}
function releaseSeatController(socket, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { showId, x, y } = data;
            const show = yield show_model_1.Show.findById(showId);
            if (!show) {
                console.error(logger_1.messages.RECORD_NOT_FOUND);
                return socket.emit('seatResponse', {
                    status: enum_1.SocketStatus.Failure,
                    message: logger_1.messages.RECORD_NOT_FOUND,
                });
            }
            const seat = show.seats.find(seat => seat.x === x && seat.y === y);
            if (seat === undefined) {
                console.error(logger_1.messages.RECORD_NOT_FOUND);
                return socket.emit('seatResponse', {
                    status: enum_1.SocketStatus.Failure,
                    message: logger_1.messages.SEAT_NOT_FOUND,
                });
            }
            seat.status = enum_1.SeatStatus.Available;
            show.save();
            socket.emit('seatResponse', {
                status: enum_1.SocketStatus.Success,
                message: logger_1.messages.SEAT_RESERVED_NOW,
            });
            (0, socket_1.getIo)().emit('seatUpdate', Object.assign(Object.assign({}, data), { seatStatus: seat.status }));
        }
        catch (error) {
            if (error instanceof Error) {
                (0, logger_1.logError)(error);
            }
            else {
                console.error(logger_1.messages.UNKNOWN_ERROR);
            }
        }
    });
}
function confirmSeatController(socket, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { showId, x, y } = data;
            const show = yield show_model_1.Show.findById(showId);
            if (!show) {
                console.error(logger_1.messages.RECORD_NOT_FOUND);
                return socket.emit('seatResponse', {
                    status: enum_1.SocketStatus.Failure,
                    message: logger_1.messages.RECORD_NOT_FOUND,
                });
            }
            const seat = show.seats.find(seat => seat.x === x && seat.y === y);
            if (seat === undefined) {
                console.error(logger_1.messages.RECORD_NOT_FOUND);
                return socket.emit('seatResponse', {
                    status: enum_1.SocketStatus.Failure,
                    message: logger_1.messages.SEAT_NOT_FOUND,
                });
            }
            if (seat.status !== enum_1.SeatStatus.Reserved) {
                return socket.emit('seatResponse', {
                    status: enum_1.SocketStatus.Failure,
                    message: logger_1.messages.SEAT_CANNOT_BOOK,
                });
            }
            seat.status = enum_1.SeatStatus.Booked;
            show.save();
            socket.emit('seatResponse', {
                status: enum_1.SocketStatus.Success,
                message: logger_1.messages.SEAT_BOOKED_NOW,
            });
            (0, socket_1.getIo)().emit('seatUpdate', Object.assign(Object.assign({}, data), { seatStatus: seat.status }));
        }
        catch (error) {
            if (error instanceof Error) {
                (0, logger_1.logError)(error);
            }
            else {
                console.error(logger_1.messages.UNKNOWN_ERROR);
            }
        }
    });
}
//# sourceMappingURL=socket.controller.js.map