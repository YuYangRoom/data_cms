var mongoose = require('mongoose');
var logger4js=require('../utils/log').logger;
require("../config/Config.js");
//logger4js.info("***********:"+global.db);
//mongoose.connect('mongodb://123.57.149.81/travel1', function (err) {
//mongoose.connect('mongodb://106.186.17.25/travel1', function (err) {
//mongoose.connect('mongodb://182.92.176.84/travel1', function (err) {
mongoose.connect(global.db, function (err) {
//mongoose.connect('mongodb://182.92.176.84/travel1', function (err) {
 // mongoose.connect('mongodb://123.57.149.81/travel1', function (err) {
//mongoose.connect('mongodb://106.186.17.25/travel1', function (err) {
  if (err) {
    console.error('connect to %s error: ', global.db, err.message);
    process.exit(1);
  }
});

// models
require('./category');
require('./brand');
require('./event_cms');
require('./version');
require('./recommendRule');
require('./recommendTime');
require('./recommendInfo');
require('./people');
require('./pgc');
require('./news');
require('./banner');
require('./activity');
require('./lifetag');
require('./restaurant');
require('./shopping');
require('./entertainment');
require('./bigtype');
require('./area');
require('./task');
require('./taskquestion');
require('./auditing');
require('./path');
require('./city');
require('./attraction');
require('./label');
require('./edituser');

exports.Category = mongoose.model('Category');
exports.Brand = mongoose.model('Brand');
exports.Event_cms = mongoose.model('Event_cms');
exports.RecommendInfo = mongoose.model('RecommendInfo');
exports.People = mongoose.model('People');
exports.Version = mongoose.model('Version');
exports.RecommendTime = mongoose.model('RecommendTime');
exports.RecommendRule = mongoose.model('RecommendRule');
exports.Pgc = mongoose.model('Pgc');
exports.News = mongoose.model('News');
exports.Banner = mongoose.model('Banner');
exports.Activity = mongoose.model('Activity');
exports.Entertainment = mongoose.model('Entertainment');
exports.Lifetag = mongoose.model('Lifetag');
exports.Restaurant = mongoose.model('Restaurant');
exports.Shopping = mongoose.model('Shopping');
exports.Bigtype = mongoose.model('Bigtype');
exports.Area = mongoose.model('Area');
exports.Task = mongoose.model('Task');
exports.Taskquestion = mongoose.model('Taskquestion');
exports.Auditing = mongoose.model('Auditing');
exports.Path = mongoose.model('Path');
exports.City = mongoose.model('City');
exports.Attraction = mongoose.model('Attraction');
exports.Label = mongoose.model('Label');
exports.Editor = mongoose.model('Edituser');
