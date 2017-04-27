var models = require('../models');
var Restaurant = models.Restaurant;
var ObjectID = require('mongodb').ObjectID;
var googleInfo = require('../routes/googleInfoSpider');
exports.getRestaurant = function (id, callback) {
    Restaurant.findOne({_id: id}, callback);
};
exports.findRestaurants = function (query, option, callback) {
    var query = Restaurant.find(query);
    query.limit(option.limit);
    query.skip(option.skip);
    query.exec(callback);

};
exports.countRestaurant = function (query, callback) {
    Restaurant.count(query, callback);
};
exports.getRestaurantByName = function (query, callback) {
    Restaurant.findOne(query, callback);
};

exports.getRestaurants = function (skip, pageLimit, query, callback) {
    Restaurant.find(query, [], {
        sort: [['city_name', 'asc'], ['index_flag', 'desc'], ['show_flag', 'desc'], ['ranking', 'asc']],
        skip: skip,
        limit: pageLimit
    }, function (err, restaurants) {
        if (err)
            callback(err);
        else {
            callback(null, restaurants);
        }
    });
};

var isIn = function (id, big) {
    for (var i = 0; i < big._ids.length; i++) {
        if (id.toString() == big._ids[i].toString())
            return true;
    }
    return false;
};

var isInTmp = function (a, b) {
    for (var i = 0; i < b.length; i++) {
        if (a.en_name == b[i].en_name) {
            return true;
        }
    }
    return false;
};

// exports.getRestaurantsByQuery = function(query,callback){
// 	console.info();
// 	Restaurant.find(query, function (err, restaurants) {
// 		console.log(">>>>>"+restaurants);
// 		if(err)
// 			callback(err);
// 		else{
// 			callback(null,restaurants);
// 		}
// 	});
// };
exports.getRestaurantOne = function (id, callback) {
    Restaurant.findOne({_id: id}, callback);
};

exports.getRestaurantsByQuery = function (id, callback) {
    exports.getRestaurantOne(id, function (err, restaurant) {
        if (restaurant) {
            callback(null, restaurant);
        } else {
            callback(err, restaurant);
        }
    });
};

exports.getRestaurantsByOptions = function (query, options, callback) {
    Restaurant.find(query, [], options, callback);
};

exports.count = function (query, callback) {
    Restaurant.count(query, callback);
};

exports.updateShowFlag = function (_id, show_flag, callback) {
    exports.getRestaurant(_id, function (err, one) {
        if (one) {
            one.show_flag = show_flag;
            one.save(function (err2) {
                callback(err2, one);
            });
        } else {
            callback(err, one);
        }
    });
};

exports.update = function (one, callback) {
    // Restaurant.update({},{$unset:{local_flag:1}},false);
    exports.getRestaurant(new ObjectID(one._id + ''), function (err, restaurant) {
        if (restaurant) {
            var comments = [];
            //var array_text = [];
            //array_text.push({title:1,rating:2,text:3,date:2015,nickname:'sdfasdfsadf'});
            //array_text.push(one.comments_top);
            comments.push(one.comments);
            var loc = [];
            loc.push(Number(one.longitude));
            loc.push(Number(one.latitude));

            restaurant.loc = loc;
            restaurant.comments_top = one.comments_top;
            restaurant.restags = one.restags;
            restaurant.name = one.name;
            restaurant.poi_sortType = one.poi_sortType;
            restaurant.city_name = one.city_name;
            restaurant.city_id = one.city_id;
            restaurant.latitude = one.latitude;
            restaurant.longitude = one.longitude;
            restaurant.address = one.address;
            restaurant.postal_code = one.postal_code;
            restaurant.brief_introduce = one.brief_introduce;
            restaurant.introduce = one.introduce;
            restaurant.tips = one.tips;
            restaurant.tel = one.tel;
            restaurant.category = one.category;
            //restaurant.categories = one.categories;
            restaurant.lifetag = one.lifetag;
            restaurant.open_time = one.open_time;
            restaurant.show_flag = one.show_flag;
            restaurant.price_level = one.price_level;
            restaurant.price_desc = one.price_desc;
            restaurant.url = one.url;
            //	if(one.comments_url.indexOf('Restaurant_Review')>0){
            //			restaurant.comments_url=one.comments_url;
            //			}
            //	restaurant.comments_url=one.comments_url;

            restaurant.website = one.website;
            restaurant.recommand_flag = one.recommand_flag;
            restaurant.recommand_duration = one.recommand_duration;
            restaurant.index_flag = one.index_flag;
            restaurant.am = one.am;
            restaurant.pm = one.pm;
            restaurant.ev = one.ev;
            restaurant.rating = one.rating;
            restaurant.ranking = one.ranking;
            restaurant.reviews = one.reviews;
            //restaurant.comments = comments;
            restaurant.tags = one.tags;
            restaurant.tags_zh = one.tags_zh;
            restaurant.info = one.info;
            restaurant.openTable_url = one.openTable_url;

            restaurant.save(function (err) {
                console.debug(err);
                callback(err, restaurant);
            });

        } else {
            callback(err + 'not found!');
        }
    });
};

exports.updatemsg = function (one, callback) {
    var _id = one._id;
    //console.log(typeof one.index_flag);
    var comments = [];
    comments.push(one.comments);
    Restaurant.update({_id: new ObjectID(_id)}, {
        $set: {
            name: one.name,
            city_name: one.city_name,
            // city_id : new ObjectID(one.city_id),
            latitude: one.latitude,
            longitude: one.longitude,
            address: one.address,
            brief_introduce: one.brief_introduce,
            introduce: one.introduce,
            tips: one.tips,
            tel: one.tel,
            tags: one.tags,
            category: one.category,
            lifetag: one.lifetag,
            open_time: one.open_time,
            show_flag: one.show_flag,
            price_level: one.price_level,
            price_desc: one.price_desc,
            url: one.url,
            website: one.website,
            recommand_flag: one.recommand_flag,
            recommand_duration: one.recommand_duration,
            index_flag: one.index_flag,
            am: one.am,
            pm: one.pm,
            ev: one.ev,
            rating: one.rating,
            ranking: one.ranking,
            reviews: one.reviews,
            comments: comments,
            info: one.info,
            en_info: {
                introduce: one.en_info.introduce,
                tips: one.en_info.tips,
                comments: one.en_info.comments
            }
        }
    }, callback)
}
exports.updateAudit = function (one, callback) {
    Restaurant.update({name: one.name}, {
        $set: {
            status: one.status,
            editorname: one.editorname,
            editdate: one.editdate,
            auditorname: one.auditorname,
            auditdate: one.auditdate
        }
    }, function (err, result) {
        console.log(err);
    })
}
exports.newAndSave = function (one, callback) {
    var place_id = one.placeId;
    if (place_id != null && place_id != '') {
        googleInfo.googlePlaceSpider(place_id, function (err, call_result) {
            if (call_result) {
                var resultData = JSON.parse(call_result);
                var resultData_2 = resultData.result;
                if (resultData_2.formatted_address) {
                    var address_1 = resultData_2.formatted_address;
                }
                if (resultData_2.international_phone_number) {
                    var telno_1 = resultData_2.international_phone_number;
                }
                if (resultData_2.geometry.location) {
                    var lat_1 = resultData_2.geometry.location.lat;
                    var lng_1 = resultData_2.geometry.location.lng;
                }
                if (resultData_2.name) {
                    var name_en = resultData_2.name;
                }
                if (resultData_2.website) {
                    var website = resultData_2.website;
                }
                var opentime_1 = [];
                var opentime_desc= [];
                if (typeof(resultData_2.opening_hours) != 'undefined') {
                    if (resultData_2.opening_hours.periods) {
                        opentime_1=resultData_2.opening_hours.periods;
                    }
                    if (resultData_2.opening_hours.weekday_text) {
                        for (var k = 0; k < resultData_2.opening_hours.weekday_text.length; k++) {
                            //console.log( resultData_2.opening_hours.weekday_text[k]);
                            var item = {};
                            var  time_desc = resultData_2.opening_hours.weekday_text[k];
                            var time_desc_2=time_desc.substring(0,time_desc.indexOf(':')).trim();
                            switch(time_desc_2){
                                case 'Monday':
                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                    var b = test_2.split(',');
                                    if (b.length <= 3) {
                                        for (var i = 0; i < b.length; i++) {
                                            var b_v = b[i];
                                            if(b_v.indexOf('–')>=0) {
                                                var b_1 = b_v.substring(0, b_v.indexOf('–'));
                                                var b_2 = b_v.substring(b_v.indexOf('–') + 1, b_v.length);
                                                var v_1;
                                                var v_2;
                                                if (b_1.indexOf('AM') > 0) {
                                                    v_1 = b_1.replace('AM', '').replace(/\s+/g, '');
                                                    // console.log(v_1);
                                                } else if (b_1.indexOf('PM') > 0) {
                                                    var numb = Number(b_1.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                } else if (b_2.indexOf('PM') > 0) {
                                                    var numb = Number(b_1.replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                } else {
                                                    v_1 = b_1;
                                                }
                                                if (b_2.indexOf('PM') > 0) {
                                                    var numb = Number(b_2.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt = (numb + 1200) + '';
                                                    v_2 = nt.substring(0, 2) + ':' + nt.substring(2, 4);
                                                } else if (b_2.indexOf('AM') > 0) {
                                                    v_2 = b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else if (b_1.indexOf('AM') > 0) {
                                                    v_2 = b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else {
                                                    v_2 = b_2;
                                                }
                                                var vv_11 = '星期一:';

                                                if (i == 0) {
                                                    var vv_1 = v_1 + '–' + v_2;
                                                }
                                                if (i == 1) {
                                                    var vv_2 = v_1 + '–' + v_2;
                                                }
                                                if (i == 2) {
                                                    var vv_3 = v_1 + '–' + v_2;
                                                }
                                                if (b.length == 1) {
                                                    vv_11 = vv_11 + vv_1;
                                                } else if (b.length == 2) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2;
                                                } else if (b.length == 3) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2 + ',' + vv_3
                                                }
                                            }else{
                                                var vv_11='休息';
                                            }
                                        }
                                        var desc_1=vv_11;
                                    }else{
                                        var desc_1=time_desc.replace(new RegExp("Monday:","gm"),"").replace(/\s+/g, '');
                                    }
                                    item.value='';
                                    item.desc=desc_1;
                                    break;
                                case 'Tuesday':
                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                    var b = test_2.split(',');
                                    if (b.length <= 3) {
                                        for (var i = 0; i < b.length; i++) {
                                            var b_v = b[i];
                                            if(b_v.indexOf('–')>=0) {
                                                var b_1 = b_v.substring(0, b_v.indexOf('–'));
                                                var b_2 = b_v.substring(b_v.indexOf('–') + 1, b_v.length);
                                                var v_1;
                                                var v_2;
                                                if (b_1.indexOf('AM') > 0) {
                                                    v_1 = b_1.replace('AM', '').replace(/\s+/g, '');
                                                    // console.log(v_1);
                                                } else if (b_1.indexOf('PM') > 0) {
                                                    var numb = Number(b_1.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                } else if(b_2.indexOf('PM')>0){
                                                    var numb = Number(b_1.replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                }else {
                                                    v_1 = b_1;
                                                }
                                                if (b_2.indexOf('PM') > 0) {
                                                    var numb = Number(b_2.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt = (numb + 1200) + '';
                                                    v_2 = nt.substring(0, 2) + ':' + nt.substring(2, 4);
                                                } else if (b_2.indexOf('AM') > 0) {
                                                    v_2 = b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else if(b_1.indexOf('AM')>0){
                                                    v_2=b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else{
                                                    v_2 = b_2;
                                                }
                                                var vv_11 = '星期二:';
                                                if (i == 0) {
                                                    var vv_1 = v_1 + '–' + v_2;
                                                }
                                                if (i == 1) {
                                                    var vv_2 = v_1 + '–' + v_2;
                                                }
                                                if (i == 2) {
                                                    var vv_3 = v_1 + '–' + v_2;
                                                }
                                                if (b.length == 1) {
                                                    vv_11 = vv_11 + vv_1;
                                                } else if (b.length == 2) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2;
                                                } else if (b.length == 3) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2 + ',' + vv_3
                                                }
                                            }else{
                                                var vv_11='休息';
                                            }
                                        }
                                        var desc_1=vv_11;
                                    }else{
                                        var desc_1=time_desc.replace(new RegExp("Tuesday:","gm"),"").replace(/\s+/g, '');
                                    }
                                    item.value='';
                                    item.desc=desc_1;
                                    break;
                                case 'Wednesday':
                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                    var b = test_2.split(',');
                                    if (b.length <= 3) {
                                        for (var i = 0; i < b.length; i++) {
                                            var b_v = b[i];
                                            if(b_v.indexOf('–')>=0) {
                                                var b_1 = b_v.substring(0, b_v.indexOf('–'));
                                                var b_2 = b_v.substring(b_v.indexOf('–') + 1, b_v.length);
                                                var v_1;
                                                var v_2;
                                                if (b_1.indexOf('AM') > 0) {
                                                    v_1 = b_1.replace('AM', '').replace(/\s+/g, '');
                                                    // console.log(v_1);
                                                } else if (b_1.indexOf('PM') > 0) {
                                                    var numb = Number(b_1.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                } else if(b_2.indexOf('PM')>0){
                                                    var numb = Number(b_1.replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                }else {
                                                    v_1 = b_1;
                                                }
                                                if (b_2.indexOf('PM') > 0) {
                                                    var numb = Number(b_2.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt = (numb + 1200) + '';
                                                    v_2 = nt.substring(0, 2) + ':' + nt.substring(2, 4);
                                                } else if (b_2.indexOf('AM') > 0) {
                                                    v_2 = b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else if(b_1.indexOf('AM')>0){
                                                    v_2=b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else{
                                                    v_2 = b_2;
                                                }
                                                var vv_11 = '星期三:';
                                                if (i == 0) {
                                                    var vv_1 = v_1 + '–' + v_2;
                                                }
                                                if (i == 1) {
                                                    var vv_2 = v_1 + '–' + v_2;
                                                }
                                                if (i == 2) {
                                                    var vv_3 = v_1 + '–' + v_2;
                                                }
                                                if (b.length == 1) {
                                                    vv_11 = vv_11 + vv_1;
                                                } else if (b.length == 2) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2;
                                                } else if (b.length == 3) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2 + ',' + vv_3
                                                }
                                            }else{
                                                var vv_11='休息';
                                            }
                                        }
                                        var desc_1=vv_11;
                                    }else{
                                        var desc_1=time_desc.replace(new RegExp("Wednesday:","gm"),"").replace(/\s+/g, '');
                                    }
                                    item.value='';
                                    item.desc=desc_1;
                                    break;
                                case 'Thursday':
                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                    var b = test_2.split(',');
                                    if (b.length <= 3) {
                                        for (var i = 0; i < b.length; i++) {
                                            var b_v = b[i];
                                            if(b_v.indexOf('–')>=0) {
                                                var b_1 = b_v.substring(0, b_v.indexOf('–'));
                                                var b_2 = b_v.substring(b_v.indexOf('–') + 1, b_v.length);
                                                var v_1;
                                                var v_2;
                                                if (b_1.indexOf('AM') > 0) {
                                                    v_1 = b_1.replace('AM', '').replace(/\s+/g, '');
                                                    // console.log(v_1);
                                                } else if (b_1.indexOf('PM') > 0) {
                                                    var numb = Number(b_1.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                } else if(b_2.indexOf('PM')>0){
                                                    var numb = Number(b_1.replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                }else {
                                                    v_1 = b_1;
                                                }
                                                if (b_2.indexOf('PM') > 0) {
                                                    var numb = Number(b_2.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt = (numb + 1200) + '';
                                                    v_2 = nt.substring(0, 2) + ':' + nt.substring(2, 4);
                                                } else if (b_2.indexOf('AM') > 0) {
                                                    v_2 = b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else if(b_1.indexOf('AM')>0){
                                                    v_2=b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else{
                                                    v_2 = b_2;
                                                }
                                                var vv_11 = '星期四:';
                                                if (i == 0) {
                                                    var vv_1 = v_1 + '–' + v_2;
                                                }
                                                if (i == 1) {
                                                    var vv_2 = v_1 + '–' + v_2;
                                                }
                                                if (i == 2) {
                                                    var vv_3 = v_1 + '–' + v_2;
                                                }
                                                if (b.length == 1) {
                                                    vv_11 = vv_11 + vv_1;
                                                } else if (b.length == 2) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2;
                                                } else if (b.length == 3) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2 + ',' + vv_3
                                                }
                                            }else{
                                                var vv_11='休息';
                                            }
                                        }
                                        var desc_1=vv_11;
                                    }else{
                                        var desc_1=time_desc.replace(new RegExp("Thursday:","gm"),"").replace(/\s+/g, '');
                                    }
                                    item.value='';
                                    item.desc=desc_1;
                                    break;
                                case 'Friday':
                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                    var b = test_2.split(',');
                                    if (b.length <= 3) {
                                        for (var i = 0; i < b.length; i++) {
                                            var b_v = b[i];
                                            if(b_v.indexOf('–')>=0) {
                                                var b_1 = b_v.substring(0, b_v.indexOf('–'));
                                                var b_2 = b_v.substring(b_v.indexOf('–') + 1, b_v.length);
                                                var v_1;
                                                var v_2;
                                                if (b_1.indexOf('AM') > 0) {
                                                    v_1 = b_1.replace('AM', '').replace(/\s+/g, '');
                                                    // console.log(v_1);
                                                } else if (b_1.indexOf('PM') > 0) {
                                                    var numb = Number(b_1.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                } else if(b_2.indexOf('PM')>0){
                                                    var numb = Number(b_1.replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                }else {
                                                    v_1 = b_1;
                                                }
                                                if (b_2.indexOf('PM') > 0) {
                                                    var numb = Number(b_2.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt = (numb + 1200) + '';
                                                    v_2 = nt.substring(0, 2) + ':' + nt.substring(2, 4);
                                                } else if (b_2.indexOf('AM') > 0) {
                                                    v_2 = b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else if(b_1.indexOf('AM')>0){
                                                    v_2=b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else{
                                                    v_2 = b_2;
                                                }
                                                var vv_11 = '星期五:';
                                                if (i == 0) {
                                                    var vv_1 = v_1 + '–' + v_2;
                                                }
                                                if (i == 1) {
                                                    var vv_2 = v_1 + '–' + v_2;
                                                }
                                                if (i == 2) {
                                                    var vv_3 = v_1 + '–' + v_2;
                                                }
                                                if (b.length == 1) {
                                                    vv_11 = vv_11 + vv_1;
                                                } else if (b.length == 2) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2;
                                                } else if (b.length == 3) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2 + ',' + vv_3
                                                }
                                            }else{
                                                var vv_11='休息';
                                            }
                                        }
                                        var desc_1=vv_11;
                                    }else{
                                        var desc_1=time_desc.replace(new RegExp("Friday:","gm"),"").replace(/\s+/g, '');
                                    }
                                    item.value='';
                                    item.desc=desc_1;
                                    break;
                                case 'Saturday':
                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                    var b = test_2.split(',');
                                    if (b.length <= 3) {
                                        for (var i = 0; i < b.length; i++) {
                                            var b_v = b[i];
                                            if(b_v.indexOf('–')>=0) {
                                                var b_1 = b_v.substring(0, b_v.indexOf('–'));
                                                var b_2 = b_v.substring(b_v.indexOf('–') + 1, b_v.length);
                                                var v_1;
                                                var v_2;
                                                if (b_1.indexOf('AM') > 0) {
                                                    v_1 = b_1.replace('AM', '').replace(/\s+/g, '');
                                                    // console.log(v_1);
                                                } else if (b_1.indexOf('PM') > 0) {
                                                    var numb = Number(b_1.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                } else if(b_2.indexOf('PM')>0){
                                                    var numb = Number(b_1.replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                }else {
                                                    v_1 = b_1;
                                                }
                                                if (b_2.indexOf('PM') > 0) {
                                                    var numb = Number(b_2.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt = (numb + 1200) + '';
                                                    v_2 = nt.substring(0, 2) + ':' + nt.substring(2, 4);
                                                } else if (b_2.indexOf('AM') > 0) {
                                                    v_2 = b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else if(b_1.indexOf('AM')>0){
                                                    v_2=b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else{
                                                    v_2 = b_2;
                                                }
                                                var vv_11 = '星期六:';
                                                if (i == 0) {
                                                    var vv_1 = v_1 + '–' + v_2;
                                                }
                                                if (i == 1) {
                                                    var vv_2 = v_1 + '–' + v_2;
                                                }
                                                if (i == 2) {
                                                    var vv_3 = v_1 + '–' + v_2;
                                                }
                                                if (b.length == 1) {
                                                    vv_11 = vv_11 + vv_1;
                                                } else if (b.length == 2) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2;
                                                } else if (b.length == 3) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2 + ',' + vv_3
                                                }
                                            }else{
                                                var vv_11='休息';
                                            }
                                        }
                                        var desc_1=vv_11;
                                    }else{
                                        var desc_1=time_desc.replace(new RegExp("Saturday:","gm"),"").replace(/\s+/g, '');
                                    }
                                    item.value='';
                                    item.desc=desc_1;
                                    break;
                                case 'Sunday':
                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                    var b = test_2.split(',');
                                    if (b.length <= 3) {
                                        for (var i = 0; i < b.length; i++) {
                                            var b_v = b[i];
                                            if(b_v.indexOf('–')>=0) {
                                                var b_1 = b_v.substring(0, b_v.indexOf('–'));
                                                var b_2 = b_v.substring(b_v.indexOf('–') + 1, b_v.length);
                                                var v_1;
                                                var v_2;
                                                if (b_1.indexOf('AM') > 0) {
                                                    v_1 = b_1.replace('AM', '').replace(/\s+/g, '');
                                                    // console.log(v_1);
                                                } else if (b_1.indexOf('PM') > 0) {
                                                    var numb = Number(b_1.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                } else if(b_2.indexOf('PM')>0){
                                                    var numb = Number(b_1.replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt1 = (numb + 1200) + '';
                                                    v_1 = nt1.substring(0, 2) + ':' + nt1.substring(2, 4);
                                                }else {
                                                    v_1 = b_1;
                                                }
                                                if (b_2.indexOf('PM') > 0) {
                                                    var numb = Number(b_2.replace('PM', '').replace(':', '').replace(/\s+/g, ''));
                                                    // v_2=
                                                    var nt = (numb + 1200) + '';
                                                    v_2 = nt.substring(0, 2) + ':' + nt.substring(2, 4);
                                                } else if (b_2.indexOf('AM') > 0) {
                                                    v_2 = b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else if(b_1.indexOf('AM')>0){
                                                    v_2=b_2.replace('AM', '').replace(/\s+/g, '');
                                                } else{
                                                    v_2 = b_2;
                                                }
                                                var vv_11 = '星期日:';
                                                if (i == 0) {
                                                    var vv_1 = v_1 + '–' + v_2;
                                                }
                                                if (i == 1) {
                                                    var vv_2 = v_1 + '–' + v_2;
                                                }
                                                if (i == 2) {
                                                    var vv_3 = v_1 + '–' + v_2;
                                                }
                                                if (b.length == 1) {
                                                    vv_11 = vv_11 + vv_1;
                                                } else if (b.length == 2) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2;
                                                } else if (b.length == 3) {
                                                    vv_11 = vv_11 + vv_1 + ',' + vv_2 + ',' + vv_3
                                                }
                                            }else{
                                                var vv_11='休息';
                                            }
                                        }
                                        var desc_1=vv_11;
                                    }else{
                                        var desc_1=time_desc.replace(new RegExp("Sunday:","gm"),"").replace(/\s+/g, '');
                                    }
                                    item.value='';
                                    item.desc=desc_1;
                                    break;

                            }
                            opentime_desc.push(item);
                        }
                    }
                } else {
                    console.log('未抓取到营业时间！');
                }
                var comments_content = [];
                if (resultData_2.reviews && resultData_2.reviews.length > 0) {
                    var comments_google = resultData_2.reviews;
                    for (var i = 0; i < comments_google.length; i++) {
                        var item = {};
                        item.rating = comments_google[i].rating;
                        item.text = comments_google[i].text;
                        item.language = comments_google[i].language;
                        var date = new Date(Number(comments_google[i].time) * 1000);
                        item.date = date.getFullYear() + '年' + date.getMonth() + '月' + date.getDay() + '日';
                        item.nickname = comments_google[i].author_name;
                        comments_content.push(item);
                    }
                    var comments_from = 'google';
                }
              //界限
                var restaurant = new Restaurant();
                //var comments = [];
                //comments.push(one.comments);
                restaurant.name = one.name;
                restaurant.type='1';
                restaurant.place_id=place_id;
                restaurant.name_en =name_en;
                restaurant.city_name = one.city_name;
                restaurant.city_id = new ObjectID(one.city_id);
                restaurant.latitude =lat_1;
                restaurant.longitude = lng_1;
                restaurant.address =address_1;
                restaurant.postal_code = one.postal_code;
                restaurant.brief_introduce = one.brief_introduce;
                restaurant.introduce = one.introduce;
                restaurant.tips = one.tips;
                restaurant.tel =telno_1;
                restaurant.category = one.category;
                restaurant.lifetag = one.lifetag;
                restaurant.periods = opentime_1;
                restaurant.open_time = opentime_desc;
                restaurant.show_flag = one.show_flag;
                restaurant.price_level = one.price_level;
                restaurant.price_desc = one.price_desc;
                restaurant.url = one.url;
                restaurant.website = website;
                restaurant.comments_url = one.comments_url;
                restaurant.comments_from = comments_from;
                restaurant.recommand_flag = one.recommand_flag;
                restaurant.recommand_duration = one.recommand_duration;
                restaurant.index_flag = one.index_flag;
                restaurant.local_flag = one.local_flag;
                restaurant.am = one.am;
                restaurant.pm = one.pm;
                restaurant.ev = one.ev;
                if (one.area_id) {
                    restaurant.area_id = one.area_id;
                    restaurant.area_name = one.area_name;
                }
                restaurant.rating = one.rating;
                restaurant.ranking = one.ranking;
                restaurant.reviews = one.reviews;
                restaurant.comments = comments_content;
                restaurant.tags = one.tags;
                restaurant.michilin_flag = one.michilin_flag;
                restaurant.info = one.info;
                restaurant.save(function (err) {
                    callback(err, restaurant);
                });

            }else{
                var restaurant = new Restaurant();
                //var comments = [];
              var   name_en='';
                //comments.push(one.comments);
                restaurant.type='1';
                restaurant.name = one.name;
                restaurant.place_id = place_id;
                restaurant.name_en =name_en;
                restaurant.city_name = one.city_name;
                restaurant.city_id = new ObjectID(one.city_id);
                //restaurant.latitude =lat_1;
                //restaurant.longitude = lng_1;
                //restaurant.address =address_1;
                restaurant.postal_code = one.postal_code;
                restaurant.brief_introduce = one.brief_introduce;
                restaurant.introduce = one.introduce;
                restaurant.tips = one.tips;
                //restaurant.tel =telno_1;
                restaurant.category = one.category;
                restaurant.lifetag = one.lifetag;
                //restaurant.open_time = opentime_1;
                restaurant.show_flag = one.show_flag;
                restaurant.price_level = one.price_level;
                restaurant.price_desc = one.price_desc;
                restaurant.url = one.url;
                //restaurant.website = website;
                restaurant.comments_url = one.comments_url;
                //restaurant.comments_from = comments_from;
                restaurant.recommand_flag = one.recommand_flag;
                restaurant.recommand_duration = one.recommand_duration;
                restaurant.index_flag = one.index_flag;
                restaurant.local_flag = one.local_flag;
                restaurant.am = one.am;
                restaurant.pm = one.pm;
                restaurant.ev = one.ev;
                if (one.area_id) {
                    restaurant.area_id = one.area_id;
                    restaurant.area_name = one.area_name;
                }
                restaurant.rating = one.rating;
                restaurant.ranking = one.ranking;
                restaurant.reviews = one.reviews;
                //restaurant.comments = comments_content;
                restaurant.tags = one.tags;
                restaurant.michilin_flag = one.michilin_flag;
                restaurant.info = one.info;
                restaurant.save(function (err) {
                    callback(err, restaurant);
                });
            }
        });
    }
};
