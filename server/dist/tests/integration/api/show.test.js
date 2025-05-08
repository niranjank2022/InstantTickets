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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("./../../../src/app"));
const show_model_1 = require("../../../src/models/show.model");
const enum_1 = require("../../../src/config/enum");
jest.mock('../../../src/models/show.model'); // Mock `Show` model
describe('Shows API', () => {
    const showId = new mongoose_1.default.Types.ObjectId().toString();
    const venueId = new mongoose_1.default.Types.ObjectId().toString();
    beforeAll(() => {
        show_model_1.Show.deleteMany.mockResolvedValue({ deletedCount: 1 });
        show_model_1.Show.create.mockResolvedValue({
            _id: showId,
            venueId: venueId,
            name: 'Maaveeran',
            startTime: new Date('2024-03-01T18:00:00.000Z'),
            endTime: new Date('2024-03-01T21:00:00.000Z'),
            seats: Array.from({ length: 100 }, (_, i) => ({
                x: Math.floor(i / 10),
                y: i % 10,
                status: enum_1.SeatStatus.Available,
            })),
        });
    });
    afterAll(() => {
        jest.resetAllMocks();
    });
    it('should return 404 if show is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = new mongoose_1.default.Types.ObjectId().toString();
        show_model_1.Show.findById.mockResolvedValue(undefined);
        const response = yield (0, supertest_1.default)(app_1.default).get(`/apis/shows/${fakeId}`);
        expect(response.status).toBe(404);
    }));
    it('returns status code 200 if show found', () => __awaiter(void 0, void 0, void 0, function* () {
        show_model_1.Show.findById.mockResolvedValue({
            _id: showId,
            venueId: venueId,
            name: 'Maaveeran',
            startTime: new Date('2024-03-01T18:00:00.000Z'),
            endTime: new Date('2024-03-01T21:00:00.000Z'),
            seats: Array.from({ length: 100 }, (_, i) => ({
                x: Math.floor(i / 10),
                y: i % 10,
                status: enum_1.SeatStatus.Available,
            })),
        });
        const res = yield (0, supertest_1.default)(app_1.default).get(`/apis/shows/${showId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('showId', showId);
        expect(res.body.name).toBe('Maaveeran');
    }));
    it('should return 500 if server error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        let res;
        show_model_1.Show.findById.mockRejectedValue(new Error('Server Error'));
        res = yield (0, supertest_1.default)(app_1.default).get(`/apis/shows/${showId}`);
        expect(res.status).toBe(500);
        expect(consoleSpy).toHaveBeenCalledTimes(2);
        show_model_1.Show.findById.mockRejectedValue({ message: 'Error occurred' });
        res = yield (0, supertest_1.default)(app_1.default).get(`/apis/shows/${showId}`);
        expect(res.status).toBe(500);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    }));
});
//# sourceMappingURL=show.test.js.map