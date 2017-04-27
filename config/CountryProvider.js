var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var DataProvider = require('./DataProvider.js').DataProvider,
    util = require('util');



var CountryProvider = function (host, port) {
    this.collectionName = "countries";
};

util.inherits(CountryProvider, DataProvider);
exports.CountryProvider = CountryProvider;