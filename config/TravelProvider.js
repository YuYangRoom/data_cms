var DataProvider = require('./DataProvider.js').DataProvider,
    util = require('util');

var TravelProvider = function() {
    this.collectionName = "travel";
};

util.inherits(TravelProvider, DataProvider);

exports.TravelProvider = TravelProvider;