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
const logger_1 = require('../config/logger');
const booking_seed_1 = require('./booking.seed');
const show_seed_1 = require('./show.seed');
const venue_seed_1 = require('./venue.seed');
function runAllSeeds() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(logger_1.messages.SEEDS_RUNNING);
        yield (0, show_seed_1.seedShows)();
        yield (0, venue_seed_1.seedVenues)();
        yield (0, booking_seed_1.seedBookings)();
        console.log(logger_1.messages.SEEDS_COMPLETED);
    });
}
;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield runAllSeeds();
}))();
//# sourceMappingURL=index.js.map