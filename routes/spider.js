/**
 * Created by Robin on 2015/8/23.
 */
var Restaurant = require('../models').Restaurant;
var Attraction = require('../models').Attraction;
var Shopping = require('../models').Shopping;
var ObjectID = require('mongodb').ObjectID;
var PathsModel = require('../models').Path;
var async = require('async');
var request = require('request');
var models = require('../models');
var logger4js = require('../utils/log').logger;


var barcelona = '516a3519f8a6461636000003';
var geneva = '516a35218902ca1936000003';
var london = '516a35218902ca1936000005';
var losangeles = '516a34f958e3511036000003';
var newyork = '516a34f958e3511036000001';
var paris = '516a350ec221c21236000003';
var roma = '51d3d238e98bbb566a000001';
var sanfrancisco = '516a34f958e3511036000002';
var singapore = '516a3535dac6182136000004';
var zurich = '516a35218902ca1936000002';
var venezia = '516a3519f8a6461636000001';


var googlekeys = [
    'AIzaSyAPZqWFwmz2Ja8q9fZrg69vPXOlX82xbwk',
    'AIzaSyBfgNQ9uBdEgUaWBJQhupDVb37D8s5aIzQ',
    'AIzaSyDWHP3R-FoAtbiPp0mY5fkbYLz3Hff1wUU',
    'AIzaSyDJxeTCF-W6eWjzv8UpBz7vJ7taXAgrY18',
    'AIzaSyA4-3qLwA5vbBbrRtJP9WWEG9vepQwAfns',
    'AIzaSyDA8pQNRsx5EaM4b8nAIFlTaCgEpziQLA0',
    'AIzaSyBANscXxo-noZQxZBZrPJ7hqF31Zq58FKo',
    'AIzaSyCDIzz65Qtxw9Sg5vXzwn3Iiij0MrGL5LI',
    'AIzaSyD01EdpU4not7zGw4ydsL4MlVQ-oI6daj0',
    'AIzaSyCRPuFtkwv6psP57c1cj0ptM4T01x4CYP4',
    'AIzaSyBVbfz1lJxRcHWd9YHs8j5jLlYQkfiyhDI',
    'AIzaSyCZwTPkIoYQZug6x-5FGP5_nGgzXql-uxE',
    'AIzaSyCUcZX4k4rToUvuX0YbhR61L-jDy2UBuYY',
    'AIzaSyCIDiUsPGdu649iDA0vXTRoEag8rFFKGW4',
    'AIzaSyCSL67WfaAd_AwPl7Xc5WmxizNBrFStyn8',
    'AIzaSyDmnKZjpnoRa4A03ompCWHdBts7pRO0Ta0',
    'AIzaSyA2CqQ75_T9NE51DsKhWDnfEaALBg0lH4U',
    'AIzaSyBsvetMPy2TM5hNe923Opz_niwv50ZVTPk',
    'AIzaSyDlma_CSUOL9G1vJk9_N1q4PRKu7VkuYtw',
    'AIzaSyCwdkuTK9dMuPgiIhqt3txuSpnHUleXY5w',
    'AIzaSyCplQxpAGb0eM8qlnzsGk5SxGp6QIVUR1g',
    'AIzaSyABHIiKFelzqw6gMRmAXU2CzdWinr00FHI',
    'AIzaSyAK9UnLCn4HkixIZDJrc-xxG3b3HxszzZk',
    'AIzaSyBW6ni_0RCi8mGjAnc3aI6huMgNPlc6NtI',
    'AIzaSyCKvfR34wHyDkni1Dm51F1znGi52PilFEc',
    'AIzaSyBEzLWEoW9Xztx27HpBdXngM1aCyhfZ5Og',
    'AIzaSyD8r2YavumK5ben46nIDy-ZY3xroITMtO8',
    'AIzaSyDIKrL_c6j9eWE2fCyxvw2xcP_E0czD0B4',
    'AIzaSyCiUgn2K2ibjQRL-TSBB5cj8Ej__Qj-3iw',
    'AIzaSyA3ZrvmM9jM45vjdBb98aXCZso43onlOKk',
    'AIzaSyDwyXsiR4KQk4fOjPYl0t0ymAsyHcCNmng',
    'AIzaSyA3mrvkZMNQ2PHGhf_8aXPCAY00ejZAQ88',
    'AIzaSyCN95PQzYAOXE6cBHZ5Tl0GNSGtNcwLmrY',
    'AIzaSyB6lvpdVej6nIKs_4B_aTS8z2qpF1DNq4I',
    'AIzaSyAQuQgy5won19S52VT-J-EksrP1AOU5um8',
    'AIzaSyA3nfic8oO9tRWKhzXrWBVMqj_AlXoVi04',
    'AIzaSyAXnJh37obRgRv4O0P-QSv8Ffs3wj7jqQE',
    'AIzaSyAKzLLVe_2n8YX68BnhLPVfLg8HH-0LKZE',
    'AIzaSyAmjFIs5UzR8iLikw1keW8b18M3AUdgHJE',
    'AIzaSyCtvqPkmoBehCAxWr2_G6-1tYgyuFM7DMw',
    'AIzaSyAEr73oEzt6nOvgpdW9YyYd8m1CAnzuoA0'
];

var arr = ['苏黎世'];

exports.test = function (req, res) {
    arr.forEach(function (r) {
        async.parallel({
            attraction: function (done) {
                Attraction.find({cityname: r, show_flag: 1}, function (err, result) {
                    if (err) {
                        logger4js.info(err);
                        return done(err, null);
                    }
                    exports.queryCallback(result, '0', done);
                })
            },
            //restaurant: function (done) {
            //    Restaurant.find({city_name: r, show_flag: true}, function (err, result) {
            //        if (err) {
            //            logger4js.info(err);
            //            return done(err, null);
            //        }
            //        exports.queryCallback(result, '1', done);
            //    });
            //},
            //shopping  : function (done) {
            //    Shopping.find({city_name: r, show_flag: true}, function (err, result) {
            //        if (err) {
            //            logger4js.info(err);
            //            return done(err, null);
            //        }
            //        exports.queryCallback(result, '2', done);
            //    });
            //}
        }, function (err, result) {
            if (err) {
                res.send(500, {
                    status : 500,
                    type   : 'Internal Error',
                    message: err
                })
            }
            res.send(200, {
                result: 'spide google begin. check result from google in db ==' + JSON.stringify(result)
            })
        });
    });
};

exports.queryCallback = function (result, type, cb) {
    logger4js.info(result.length + ' of type : ' + type);
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            if (j == i) {
                continue;
            }
            var one = {};
            one.city_id = result[i].city_id;
            if (type == '0') {
                one.city_name = result[i].cityname;
            } else {
                one.city_name = result[i].city_name;
            }
            one.a_id = result[i]._id;
            one.a_latitude = result[i].latitude;
            one.a_longitude = result[i].longitude;
            one.a_type = type;
            one.b_id = result[j]._id;
            one.b_latitude = result[j].latitude;
            one.b_longitude = result[j].longitude;
            one.b_type = type;
            (function (i, j, one) {
                logger4js.info(i + ':' + j);
                models.Path.findOne({
                    a_latitude : one.a_latitude,
                    a_longitude: one.a_longitude,
                    b_latitude : one.b_latitude,
                    b_longitude: one.b_longitude
                }, function (err, result) {
                    if (err) logger4js.info(err);
                    if (result == null || result == undefined) {
                        logger4js.info('null result in db : ' + JSON.stringify(one));
                        exports.getTrafficFromAtoB(one.a_latitude, one.a_longitude, one.b_latitude, one.b_longitude, function (err, googleResult) {
                            if (err) {
                                logger4js.info(err);
                            } else {
                                if (googleResult != undefined && googleResult != null) {
                                    var path = new PathsModel();
                                    path.city_id = new ObjectID(one.city_id + '');
                                    path.city_name = one.city_name;
                                    path.a_id = new ObjectID(one.a_id + '');
                                    path.a_type = one.a_type;
                                    path.b_id = new ObjectID(one.b_id + '');
                                    path.b_type = one.b_type;
                                    path.a_latitude = one.a_latitude;
                                    path.a_longitude = one.a_longitude;
                                    path.b_latitude = one.b_latitude;
                                    path.b_longitude = one.b_longitude;
                                    //steps
                                    path.bus.steps = googleResult.bus.steps;
                                    path.bus.duration = googleResult.bus.duration.value;
                                    path.bus.distance = googleResult.bus.distance.value;
                                    path.driver.steps = googleResult.driver.steps;
                                    path.driver.duration = googleResult.driver.duration.value;
                                    path.driver.distance = googleResult.driver.distance.value;
                                    //path.walk = result.walk;
                                    path.save(function (err, one_data) {
                                        if (err) logger4js.info("get the data to database error,fail to read");
                                        logger4js.info("update success!" + JSON.stringify(one_data));
                                    });
                                }
                            }
                        })
                    } else if (result.bus == null || result.driver == null ||
                        result.bus.steps == null || result.driver.steps == null ||
                        result.bus.steps.length == 0 || result.driver.steps.length == 0) {
                        logger4js.info('exist with null traffic result in db : ' + JSON.stringify(one));
                        exports.getTrafficFromAtoB(one.a_latitude, one.a_longitude, one.b_latitude, one.b_longitude, function (err, googleResult) {
                            if (err) {
                                logger4js.info(err);
                            } else {
                                if (googleResult != undefined && googleResult != null) {
                                    //steps
                                    result.bus = googleResult.bus;
                                    result.bus.duration = googleResult.bus.duration.value;
                                    result.bus.distance = googleResult.bus.distance.value;
                                    result.driver = googleResult.driver;
                                    result.driver.duration = googleResult.driver.duration.value;
                                    result.driver.distance = googleResult.driver.distance.value;
                                    //path.walk = result.walk;
                                    result.save(function (err, one_data) {
                                        if (err) logger4js.info("get the data to database error,fail to read");
                                        logger4js.info("update success!" + JSON.stringify(one_data));
                                    });
                                }
                            }
                        })
                    }
                })
            })(i, j, one);
        }
    }
    cb(null, type);
};

exports.getTrafficFromAtoB = function (a_lat, a_lng, b_lat, b_lng, cb) {
    var o = a_lat + ',' + a_lng,
        d = b_lat + ',' + b_lng;
    var googlemode;
    var sensor = "false";
    var random = Math.round(Math.random() * (googlekeys.length - 1));
    var googlekey = googlekeys[random];
    logger4js.info('spide google begin');
    async.parallel({
        bus   : function (callback) {
            googlemode = "transit";
            var myurl = getGoogleUrl(o, d, googlemode, sensor, googlekey);
            logger4js.info(myurl);
            request(myurl, function (error, response, body) {
                if (error) {
                    logger4js.info(error);
                    return callback(error, null);
                }
                logger4js.info('===============================');
                body = JSON.parse(body);
                logger4js.info('bus status ============' + String(body.status));
                var bus = {};
                if (body.status == "OK") {
                    return callback(null, body.routes[0].legs[0]);
                } else if (body.status == 'ZERO_RESULTS') {
                    bus.distance = {};
                    bus.duration = {};
                    //bus.steps = [];
                    //bus.steps.push({html: 'Zero results errors'});
                    bus.steps = {html: 'Zero results errors'};
                    bus.distance.value = 0;
                    bus.duration.value = 0;
                    logger4js.info(' get google bus ZERO_RESULTS ');
                    return callback(null, bus);
                } else {
                    bus.distance = {};
                    bus.duration = {};
                    //bus.steps = [];
                    //bus.steps.push({html: 'Google Not Found'});
                    bus.steps = {html: 'Google Not Found'};
                    bus.distance.value = 0;
                    bus.duration.value = 0;
                    logger4js.info(' get google bus faild: ');
                    return callback(null, bus);
                }
            })
        },
        driver: function (callback) {
            googlemode = "driving";
            var myurl = getGoogleUrl(o, d, googlemode, sensor, googlekey);
            logger4js.info(myurl);
            request(myurl, function (error, response, body) {
                logger4js.info('===============================');
                if (error) {
                    logger4js.info(error);
                    return callback(error, null);
                }
                body = JSON.parse(body);
                logger4js.info('driving status ===========' + String(body.status));
                var driver = {};
                if (body.status == "OK") {
                    return callback(null, body.routes[0].legs[0]);
                } else if (body.status == 'ZERO_RESULTS') {
                    driver.distance = {};
                    driver.duration = {};
                    //driver.steps = [];
                    //driver.steps.push({html: 'Zero results errors'});
                    driver.steps = {html: 'Zero results errors'};
                    driver.distance.value = 0;
                    driver.duration.value = 0;
                    logger4js.info(' get google driver ZERO_RESULTS ');
                    return callback(null, driver);
                } else {
                    driver.distance = {};
                    driver.duration = {};
                    //driver.steps = [];
                    //driver.steps.push({html: 'Google Not Found'});
                    driver.steps = {html: 'Google Not Found'};
                    driver.distance.value = 0;
                    driver.duration.value = 0;
                    logger4js.info(' get google driver faild: ');
                    return callback(null, driver);
                }
            })
        }
    }, function (err, result) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, result);
    })
};

var apiurl = 'https://maps.googleapis.com/maps/api/directions/json';

function getGoogleUrl(o, d, mode, sensor, key) {
    var url = apiurl;
    url += "?origin=" + o;
    url += "&destination=" + d;
    url += "&mode=" + mode;
    var departure_time = Math.round(new Date().getTime() / 1000);
    url += "&departure_time=" + departure_time;
    url += "&sensor=" + sensor;
    url += "&key=" + key;
    return url;
}