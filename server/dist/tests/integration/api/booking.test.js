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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("./../../../src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = require("../../../src/models/booking.model");
jest.mock('../../../src/models/booking.model');
describe('Bookings API', () => {
    const mockBooking = {
        _id: new mongoose_1.default.Types.ObjectId().toString(),
        userId: new mongoose_1.default.Types.ObjectId().toString(),
        showId: new mongoose_1.default.Types.ObjectId().toString(),
        venueId: new mongoose_1.default.Types.ObjectId().toString(),
        seats: [new mongoose_1.default.Types.ObjectId().toString(), new mongoose_1.default.Types.ObjectId().toString()],
        save: jest.fn(),
    };
    beforeAll(() => {
        booking_model_1.Booking.create.mockResolvedValue(mockBooking);
        booking_model_1.Booking.deleteMany.mockResolvedValue({ deletedCount: 1 });
    });
    afterAll(() => {
        jest.resetAllMocks();
    });
    it('should create a booking', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/apis/bookings/').send({
            userId: mockBooking.userId,
            showId: mockBooking.showId,
            venueId: mockBooking.venueId,
            seats: mockBooking.seats,
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('bookingId', mockBooking._id);
    }));
    it('should return 500 if server error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        let res;
        booking_model_1.Booking.create.mockRejectedValue(new Error('DB Error'));
        res = yield (0, supertest_1.default)(app_1.default).post('/apis/bookings/').send({
            userId: mockBooking.userId,
            showId: mockBooking.showId,
            venueId: mockBooking.venueId,
            seats: mockBooking.seats,
        });
        expect(res.status).toBe(500);
        expect(consoleSpy).toHaveBeenCalledTimes(2);
        booking_model_1.Booking.create.mockRejectedValue({ message: 'error has occurred' });
        res = yield (0, supertest_1.default)(app_1.default).post('/apis/bookings/').send({
            userId: mockBooking.userId,
            showId: mockBooking.showId,
            venueId: mockBooking.venueId,
            seats: mockBooking.seats,
        });
        expect(res.status).toBe(500);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    }));
});
//# sourceMappingURL=booking.test.js.map