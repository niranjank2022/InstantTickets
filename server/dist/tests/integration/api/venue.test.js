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
const venue_model_1 = require("../../../src/models/venue.model");
jest.mock('../../../src/models/venue.model'); // Mock Venue model
describe('Venues API', () => {
    const venueId = new mongoose_1.default.Types.ObjectId().toString();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        venue_model_1.Venue.deleteMany.mockResolvedValue({ deletedCount: 0 });
        venue_model_1.Venue.create.mockResolvedValue({
            _id: venueId,
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
        });
    }));
    afterAll(() => {
        jest.resetAllMocks();
    });
    it('return status code 404 if venue not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = new mongoose_1.default.Types.ObjectId().toString();
        venue_model_1.Venue.findById.mockResolvedValue(undefined);
        const response = yield (0, supertest_1.default)(app_1.default).get(`/apis/venues/${fakeId}`);
        expect(response.status).toBe(404);
    }));
    it('return status code 200 if venue found', () => __awaiter(void 0, void 0, void 0, function* () {
        venue_model_1.Venue.findById.mockResolvedValue({
            _id: venueId,
            name: 'Royal Theatre',
            location: '123 Main St',
            rows: 20,
            columns: 30,
            rowIndices: [...Array(20).keys()].map(i => String.fromCharCode(65 + i)),
            columnIndices: [...Array(30).keys()].map(i => (i + 1).toString()),
            sections: [
                { name: 'VIP', x: 0, y: 0, rows: 5, columns: 10, price: 100 },
                { name: 'Premium', x: 5, y: 0, rows: 5, columns: 10, price: 75 },
                { name: 'Regular', x: 10, y: 0, rows: 10, columns: 10, price: 50 },
            ],
        });
        const res = yield (0, supertest_1.default)(app_1.default).get('/apis/venues/' + venueId);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('venueId', venueId);
        expect(res.body.name).toBe('Royal Theatre');
    }));
    it('should return 500 if server error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        let res;
        venue_model_1.Venue.findById.mockRejectedValue(new Error('DB Error'));
        res = yield (0, supertest_1.default)(app_1.default).get(`/apis/venues/${venueId}`);
        expect(res.status).toBe(500);
        expect(consoleSpy).toHaveBeenCalledTimes(2);
        venue_model_1.Venue.findById.mockRejectedValue({ message: 'error has occurred' });
        res = yield (0, supertest_1.default)(app_1.default).get(`/apis/venues/${venueId}`);
        expect(res.status).toBe(500);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    }));
});
//# sourceMappingURL=venue.test.js.map