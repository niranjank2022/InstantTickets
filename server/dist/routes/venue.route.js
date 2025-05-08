'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const venue_controller_1 = require('../controllers/venue.controller');
const router = (0, express_1.Router)();
router.get('/:venueId/', venue_controller_1.getVenueById);
exports.default = router;
//# sourceMappingURL=venue.route.js.map