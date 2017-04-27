/**
 * Created with JetBrains WebStorm.
 * User: wanzhang
 * Date: 12-8-9
 * Time: 下午5:02
 * To change this template use File | Settings | File Templates.
 */
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var DataProvider = require('./DataProvider.js').DataProvider,
    util = require('util');



var AttractionsProvider = function (host, port) {
    this.collectionName = "latestattractions";
};

util.inherits(AttractionsProvider, DataProvider);
exports.AttractionsProvider = AttractionsProvider;