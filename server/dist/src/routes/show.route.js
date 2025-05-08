"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const show_controller_1 = require("../controllers/show.controller");
const router = (0, express_1.Router)();
router.get('/:showId/', show_controller_1.getShowById);
exports.default = router;
//# sourceMappingURL=show.route.js.map