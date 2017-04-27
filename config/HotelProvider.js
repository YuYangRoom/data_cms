/**
 * User: katat
 * Date: 9/8/13
 * Time: 10:18 AM
 */
var DataProvider = require('./DataProvider.js').DataProvider,
    util = require('util');

var HotelProvider = function (host, port) {
    this.collectionName = "hotel";
};

util.inherits(HotelProvider, DataProvider);
exports.HotelProvider = HotelProvider;