/**
 * Created by lhb on 15/10/07.
 */
var request = require('request');
var cheerio = require('cheerio');
var City = require('../models').City;
var Restaurant = require('../models').Restaurant;
var Attraction = require('../models').Attraction;
var Shopping = require('../models').Shopping;
var async = require('async');
var sleep = require('sleep');
var lineReader = require('line-reader');
var logger4js = require('../utils/log').logger;
var flag = require('../utils/zhReg');
//var j = 1;
exports.tripwebUrl = function (tripid, type, tripurl, callback) {
    //var tripurl2 = tripurl;
	logger4js.info('读文件抓数据开始！');
	var model = getModel(type);
    var query = getQuery(type, tripid);//定义的查询条件
    if (model == null || query == null) {
        return callback('error type:' + type, null);
    }
    model.find(query, function (err, pois) {
        if (err) {
            return callback(err, null);
        }
        async.map(pois, function (poi, cb) {
                exports.tripPOI(tripurl, type, function (err, result) {
                    if (err) {
                        return cb(err, null);
                    }
                   //savePOI(poi, result, type, cb);
                });
            }
        );
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
            console.info(err);
            return callback(err, null);
        }
        process.exit();
				//console.info('update success!' + data);
        //callback(null, data);
    });
};
exports.tripPOI = function (tripurl2, type, callback) {
    var detailUrl = tripurl2;//到此得到详细的连接地址url
    //logger4js.info(detailUrl + '   ' + j++);
    if (type == '0') {
        if (detailUrl.indexOf('Attraction_Review') < 0) {
            logger4js.info('search no result:请确定输入的是景点的url');
            return callback(null, null);
        }
    } else if (type == '1') {
        if (detailUrl.indexOf('Restaurant_Review') < 0) {
            logger4js.info('search no result:请确定输入的是餐厅的url');
            process.exit();
						return callback(null, null);
        }
    }
    exports.getDetail(detailUrl, callback);
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
var getQuery = function (type, tripid) {//查询条件
    var query;
    switch (type) {
        case '0':
            query = {_id: tripid};
            break;
        case '1':
            query = {_id: tripid};
            break;
        //case '2':
        //    query = {city_name: tripid, show_flag: true};
        //    break;
        default:
            query = null;
    }
    return query;
};
exports.getDetail = function (url, callback) {
    //logger4js.info(url);
    request(url, function (error, response, body) {
        if (error) {
            logger4js.info(error);
        }
      //  logger4js.info(response + '***************');
          if(typeof(response)=='undefined' ){
					     process.exit();
			     }

        var $ = cheerio.load(body);
        var comments_from = 'tripadvisor';
        var rating = $('.sprite-rating_rr_fill')['0'].attribs.content;
        //logger4js.info(rating);
        var reviews = $('.more')['0'].attribs.content;
        //     logger4js.info(reviews);
        var comments_url = url;
        var language = 'zh';
        var comments = [];
        $('.deckTools').nextAll('.reviewSelector').each(function (i, eme) {
            var commentDOM = $(eme).children('.review').children('.col2of2').children('.innerBubble');
            var title = commentDOM.children('.wrap').children('.quote').children().children('.noQuotes').text();
            //var rating = commentDOM.children('.wrap').children('.rating').find('img').attr('alt').substring(0, 1);
            var rating = commentDOM.children('.wrap').children('.rating').find('img').attr('alt');
            rating = isNaN(parseFloat(rating)) ? 3 : parseFloat(rating);
            var text = commentDOM.children('.wrap').children('.entry').children('.partial_entry').text().replace(/\n更多/g, '').trim();
            //var language = '';
            var date = commentDOM.children('.wrap').children('.reviewItemInline').text().trim();
            if (date.indexOf('-') > 0) {
                date = date.substring(0, date.lastIndexOf('的')).replace('-', '年').replace('-', '月') + '日';
            }
            var nickname = $(eme).children('.review').children('.col1of2').children('.member_info').children('.memberOverlayLink').children('.username').text().trim();
            logger4js.info(title);
            logger4js.info(rating);
            //logger4js.info(date);date
            if(text!=null&&text!=''){
                //console.log(text+' #### '+flag.getzhReg(text));
                if(flag.getzhReg(text)>=0.5){
                    comments.push({title: title, rating: rating, text: text, date: date, nickname: nickname,language:language});
                }
                else{
                    comments.push({title: title, rating: rating, text: text, date: date, nickname: nickname});
                }
            }
        });
        callback(null, {
            comments_from: comments_from,
            rating: rating,
            reviews: reviews,
            comments_url: comments_url,
            comments: comments
        })
    })
};
exports.tripwebUrl(process.argv[2], process.argv[3], process.argv[4], function (err, result) {//函数执行的入口
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

