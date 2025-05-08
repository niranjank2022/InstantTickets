"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../src/config/logger");
describe('logError', () => {
    it('should log the error message and stack trace', () => {
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });
        const mockError = new Error('Test error');
        mockError.stack = 'Test stack trace';
        (0, logger_1.logError)(mockError);
        expect(mockConsoleError).toHaveBeenCalledTimes(2);
        expect(mockConsoleError).toHaveBeenCalledWith('Error message: ', 'Test error');
        expect(mockConsoleError).toHaveBeenCalledWith('Error Stack Trace: ', 'Test stack trace');
        mockConsoleError.mockRestore();
    });
    it('should handle seed log messages', () => {
        expect(logger_1.messages.CLEARED_RECORDS('bookings')).toBe('Cleared existing bookings records.');
        expect(logger_1.messages.SEED_SUCCESS('bookings')).toBe('bookings seeded successfully.');
        expect(logger_1.messages.SEEDS_RUNNING).toBe('Running all seed scripts.');
        expect(logger_1.messages.SEEDS_COMPLETED).toBe('All seeds completed.');
    });
    it('should handle socket log messages', () => {
        expect(logger_1.messages.CLIENT_CONNECTED('ABCDEFGHI')).toBe('New socket client connected: ABCDEFGHI');
        expect(logger_1.messages.CLIENT_DISCONNECTED('ABCDEFGHI')).toBe('New socket client disconnected: ABCDEFGHI');
    });
});
//# sourceMappingURL=log.test.js.map