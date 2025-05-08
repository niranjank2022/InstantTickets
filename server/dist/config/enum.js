'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SocketStatus = exports.SeatStatus = void 0;
var SeatStatus;
(function (SeatStatus) {
    SeatStatus['Booked'] = 'BOOKED';
    SeatStatus['Available'] = 'AVAILABLE';
    SeatStatus['Reserved'] = 'RESERVED';
})(SeatStatus || (exports.SeatStatus = SeatStatus = {}));
var SocketStatus;
(function (SocketStatus) {
    SocketStatus['Success'] = 'SUCCESS';
    SocketStatus['Failure'] = 'FAILURE';
})(SocketStatus || (exports.SocketStatus = SocketStatus = {}));
//# sourceMappingURL=enum.js.map