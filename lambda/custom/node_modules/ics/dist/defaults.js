"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _v = _interopRequireDefault(require("uuid/v1"));

var _moment = _interopRequireDefault(require("moment"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var now = (0, _moment["default"])().utc();
var defaults = {
  title: 'Untitled event',
  productId: 'adamgibbons/ics',
  method: 'PUBLISH',
  uid: (0, _v["default"])(),
  timestamp: (0, _utils.formatUTCDateAsUTC)([now.get('year'), now.get('month') + 1, now.get('date'), now.get('hours'), now.get('minutes'), now.get('seconds')]),
  start: (0, _utils.formatUTCDateAsUTC)()
};
var _default = defaults;
exports["default"] = _default;