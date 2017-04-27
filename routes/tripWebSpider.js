/**
 * Created by onion on 15/9/23.
 */
var request = require('request');
var cheerio = require('cheerio');
var City = require('../models').City;
var Restaurant = require('../models').Restaurant;
var Attraction = require('../models').Attraction;
var Shopping = require('../models').Shopping;
var async = require('async');
var sleep = require('sleep');
var logger4js = require('../utils/log').logger;
var map = {
    '波士顿' : '60745',
    '巴塞罗那': '187497',
    '巴黎'  : '187147',
    '伦敦'  : '186338',
    '新加坡' : '294265',
    '旧金山' : '60713',
    '苏黎世' : '188113',
    '洛杉矶' : '32655',
    '纽约'  : '60763'
};
var baseUrl = 'http://www.tripadvisor.cn';
exports.tripCity = function (cities, type, skip, limit, callback) {//接受传来的参数
    var city_names = cities.split(',');//
    if (city_names == null || city_names.length == 0) {
        return callback(null, null);
    }
    async.map(city_names, function (item, cb) {//遍历每一个城市
        var model = getModel(type);//判断是景点、餐厅、购物
        var query = getQuery(type, item);//定义的查询条件
        if (model == null || query == null) {
            return callback('error type:' + type, null);
        }
        query.comments_from = {$ne: 'tripadvisor'}; //查询条件为mongoDB中comments_from字段不等于tripadvisor的数据
        //query.name = 'Agua';
        model.find(query, null, {$skip: skip, limit: limit}, function (err, pois) {
            if (err) {
                return callback(err, null);
            }
            async.map(pois, function (poi, cb) {
                var name = getPOIName(type, poi);
                if (name == null) {
                    return cb(null, null);
                }
                sleep.usleep(1000);
                exports.tripPOI(name, item, type, function (err, result) {
                    if (err) {
                        return cb(err, null);
                    }
                    savePOI(poi, result, type, cb);
                    //cb(null, result);
                });
            }, function (err, result) {
                if (err) {
                    return cb(err, null);
                }
                cb(null, result);
            });
        })
    }, function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
};
exports.tripPOI = function (name, city_name, type, callback) {
    var searchUrl = getSearchUrl(name, map[city_name]);
    logger4js.info(searchUrl + ' ==== for ' + name + ':' + city_name);
    var options = {//一种代理机制、伪装成正常用户的行为
        url    : searchUrl,
        headers: {
            //'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.99 Safari/537.36'
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) PhantomJS/19.0'
        }
    };
    request(options, function (error, response, body) {
        if (error) {
            logger4js.info(error);
        }
        sleep.usleep(1000);
        if (response.statusCode != 200) {//200表示服务器成功处理了请求
            logger4js.info(response.statusCode);
            return callback(null, null);
        }
        var $ = cheerio.load(body);//cheerio.load方法把HTML内容解析成DOM对象
        var detailUrl = $('.srHead').children()['0'].attribs.href;//到此得到详细的连接地址url
        if (type == '0') {
            if (detailUrl.indexOf('Attraction_Review') < 0) {//判断detailUrl是否有效
                logger4js.info('search no result:' + name + ':' + city_name);
                return callback(null, null);
            }
        } else if (type == '1') {
            if (detailUrl.indexOf('Restaurant_Review') < 0) {
                logger4js.info('search no result:' + name + ':' + city_name);
                return callback(null, null);
            }
        }
        exports.getDetail(baseUrl + detailUrl, callback);
    });
};
var getModel = function (type) {
    var model;
    switch (type) {
        case '0':
            model = Attraction;
            break;
        case '1':
            model = Restaurant;
            break;
        //case '2':
        //    model = Shopping;
        //    break;
        default:
            model = null;
    }
    return model;
};
var getQuery = function (type, city_name) {//查询条件
    var query;
    switch (type) {
        case '0':
            query = {cityname: city_name, show_flag: 1};
            break;
        case '1':
            query = {city_name: city_name, show_flag: true};
            break;
        //case '2':
        //    query = {city_name: city_name, show_flag: true};
        //    break;
        default:
            query = null;
    }
    return query;
};

var getPOIName = function (type, poi) {
    var name;
    switch (type) {
        case '0':
            name = poi.attractions;
            break;
        case '1':
            name = poi.name;
            break;
        //case '2':
        //    name = poi.name;
        //    break;
        default:
            name = null;
    }
    return name;
};

var getSearchUrl = function (name, city_geo) {
    return baseUrl + '/Search?q=' + name + '&geo=' + city_geo;
};
exports.getDetail = function (url, callback) {
    logger4js.info(url);
    request(url, function (error, response, body) {
        if (error) {
            logger4js.info(error);
        }
        if (response.statusCode != 200) {
            logger4js.info(response.statusCode);
            return callback(null, null);
        }
        var $ = cheerio.load(body);
        var comments_from = 'tripadvisor';
        var rating = $('.sprite-rating_rr_fill')['0'].attribs.content;
        var reviews = $('.more')['0'].attribs.content;
        var comments_url = url;
        var comments = [];
        $('.deckTools').nextAll('.reviewSelector').each(function (i, eme) {
            var commentDOM = $(eme).children('.review').children('.col2of2').children('.innerBubble');
            var title = commentDOM.children('.wrap').children('.quote').children().children('.noQuotes').text();
            var rating = commentDOM.children('.wrap').children('.rating').find('img').attr('alt').substring(0, 1);
            rating = isNaN(parseFloat(rating)) ? 3 : parseFloat(rating);
            var text = commentDOM.children('.wrap').children('.entry').children('.partial_entry').text().replace(/\n更多/g,'').trim();
            //var language = '';
            var date = commentDOM.children('.wrap').children('.reviewItemInline').text().trim();
            if (date.indexOf('-') > 0) {
                date = date.substring(0, date.lastIndexOf('的')).replace('-', '年').replace('-', '月') + '日';
            } else {
                date = commentDOM.children('.wrap').children('.reviewItemInline').children()['1'].attribs.title;
                date = date.replace('-', '年').replace('-', '月') + '日';
            }
            var nickname = $(eme).children('.review').children('.col1of2').children('.member_info').children('.memberOverlayLink').children('.username').text().trim();
            comments.push({title: title, rating: rating, text: text, date: date, nickname: nickname});
        });
        callback(null, {
            comments_from: comments_from,
            rating       : rating,
            reviews      : reviews,
            comments_url : comments_url,
            comments     : comments
        })
    })
};
var savePOI = function (poi, result, type, callback) {
    if (!result) {
        return callback(null, poi);
    }
    if (result.comments_from) {
        poi.comments_from = result.comments_from;
    }
    if (result.rating) {
        if (type == '0') {
            poi.yelp_rating = result.rating;
        } else if (type == '1') {
            poi.rating = result.rating;
        }
    }
    if (result.reviews) {
        poi.reviews = result.reviews;
    }
    if (result.comments_url) {
        poi.comments_url = result.comments_url;
    }
    if (result.comments) {
        poi.comments = result.comments.splice(0, 5);
    }
    poi.save(function (err, data) {
        if (err) {
            logger4js.info(err);
            return callback(err, null);
        }
        logger4js.info('update success!' + data);
        callback(null, data);
    });
};
//name, city_name, type
//exports.tripPOI(process.argv[2], process.argv[3], process.argv[4], function (err, result) {
//    if (err) {
//        logger4js.info(err);
//        process.exit();
//    }
//    var model = getModel(process.argv[4]);
//    var query = {name: process.argv[2]};
//    model.findOne(query, function (err, poi) {
//        if (err) {
//            logger4js.info(err);
//            process.exit();
//        }
//        if (poi == null) {
//            logger4js.info('null result in db:' + process.argv[2]);
//            process.exit();
//        }
//        savePOI(poi, result, process.argv[4], function (err, result) {
//            if (err) {
//                logger4js.info(err);
//                process.exit();
//            }
//            logger4js.info(result);
//            process.exit();
//        });
//    });
//});
//city_name type skip limit
exports.tripCity(process.argv[2], process.argv[3], process.argv[4], process.argv[5], function (err, result) {//函数执行的入口
    if (err) {
        logger4js.info(err);
        process.exit();
    }
    logger4js.info(result.length);
    logger4js.info(result);
    process.exit();
});
process.on('uncaughtException', function (err) {
    logger4js.info('Caught exception: ' + err);
});