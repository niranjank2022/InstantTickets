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
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socket_controller_1 = require("../../../src/socket/socket.controller");
const show_model_1 = require("../../../src/models/show.model");
const enum_1 = require("../../../src/config/enum");
const logger_1 = require("../../../src/config/logger");
jest.mock('../../../src/models/show.model');
describe('confirmSeatController', () => {
    let io;
    let httpServer;
    let mockSocket;
    const showId = 'testShowId';
    beforeAll(() => {
        httpServer = new http_1.Server();
        io = new socket_io_1.Server(httpServer);
    });
    beforeEach(() => {
        // Mock socket.emit()
        mockSocket = {
            emit: jest.fn(),
        };
        jest.clearAllMocks();
    });
    afterAll(() => {
        io.close();
        httpServer.close();
    });
    test('should book a reserved seat', () => __awaiter(void 0, void 0, void 0, function* () {
        show_model_1.Show.findById.mockResolvedValue({
            _id: showId,
            seats: [{ x: 1, y: 1, status: enum_1.SeatStatus.Reserved }],
            save: jest.fn(),
        });
        yield (0, socket_controller_1.confirmSeatController)(mockSocket, { showId, x: 1, y: 1 });
        expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
            status: enum_1.SocketStatus.Success,
            message: logger_1.messages.SEAT_BOOKED_NOW,
        });
        // Check if the seat status was updated to Booked
        expect((yield show_model_1.Show.findById(showId)).seats[0].status).toBe(enum_1.SeatStatus.Booked);
    }));
    test('should return failure if show is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        show_model_1.Show.findById.mockResolvedValue(null);
        yield (0, socket_controller_1.confirmSeatController)(mockSocket, { showId, x: 1, y: 1 });
        expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
            status: enum_1.SocketStatus.Failure,
            message: logger_1.messages.RECORD_NOT_FOUND,
        });
    }));
    test('should return failure if seat is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        show_model_1.Show.findById.mockResolvedValue({
            _id: showId,
            seats: [],
        });
        yield (0, socket_controller_1.confirmSeatController)(mockSocket, { showId, x: 1, y: 1 });
        expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
            status: enum_1.SocketStatus.Failure,
            message: logger_1.messages.SEAT_NOT_FOUND,
        });
    }));
    test('should return failure if seat is not reserved', () => __awaiter(void 0, void 0, void 0, function* () {
        show_model_1.Show.findById.mockResolvedValue({
            _id: showId,
            seats: [{ x: 1, y: 1, status: enum_1.SeatStatus.Available }],
        });
        yield (0, socket_controller_1.confirmSeatController)(mockSocket, { showId, x: 1, y: 1 });
        expect(mockSocket.emit).toHaveBeenCalledWith('seatResponse', {
            status: enum_1.SocketStatus.Failure,
            message: logger_1.messages.SEAT_CANNOT_BOOK,
        });
    }));
    test('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        show_model_1.Show.findById.mockRejectedValue(new Error('Database error'));
        yield (0, socket_controller_1.confirmSeatController)(mockSocket, { showId, x: 1, y: 1 });
        expect(consoleSpy).toHaveBeenCalled();
        show_model_1.Show.findById.mockRejectedValue({ message: 'error has occurred' });
        yield (0, socket_controller_1.confirmSeatController)(mockSocket, { showId, x: 1, y: 1 });
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    }));
});
//# sourceMappingURL=confirmSeat.test.js.map