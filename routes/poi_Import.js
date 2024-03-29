/**
 * Created by lhb on 15/10/07.
 */
var request = require('request');
var cheerio = require('cheerio');
var Restaurant = require('../models').Restaurant;
var Attraction = require('../models').Attraction;
var Shopping = require('../models').Shopping;
var Area = require('../models').Area;
var async = require('async');
var ObjectID = require('mongodb').ObjectID;
//var sleep = require('sleep');
var lineReader = require('line-reader');
var logger4js = require('../utils/log').logger;
var flag = require('../utils/zhReg');
var googleInfoSpider = require('../routes/googleInfoSpider');
//var j = 1;
exports.poiInfo = function (poi_id, poi_type, poi_placeId, callback) {
    //var tripurl2 = tripurl;
   console.log(poi_id + "##" + poi_type + "##" + poi_placeId);
     getInfo(poi_id,poi_type,poi_placeId,callback);
};
var getInfo=function(poi_id,poi_type ,poi_placeId,call) {
    console.log(poi_id + "#$#" + poi_type + "#$#" + poi_placeId);
    var selType = poi_type;
    var poiID = poi_id;
    if (selType == '0' || selType =='1'  || selType == 2 || selType == 3) {
        switch (selType) {
            case '0':
                Attraction.findOne({_id: poiID}, function (err, dataID) {
                    googleInfoSpider.googlePlaceSpider(dataID.place_id, function (err, call_result) {
                        var resultData = JSON.parse(call_result);
                            if (call_result ) {
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
                                    var attractions_en = resultData_2.name;
                                }
                                if (resultData_2.website) {
                                    var website = resultData_2.website;
                                }
                                var opentime_1 = [];
                                var opentime_desc = [];
                                if (typeof(resultData_2.opening_hours) != 'undefined') {
                                    if (resultData_2.opening_hours.periods) {
                                        opentime_1 = resultData_2.opening_hours.periods;
                                    }
                                    if (resultData_2.opening_hours.weekday_text) {
                                        for (var k = 0; k < resultData_2.opening_hours.weekday_text.length; k++) {
                                            //console.log( resultData_2.opening_hours.weekday_text[k]);
                                            var item = {};
                                            var time_desc = resultData_2.opening_hours.weekday_text[k];
                                            var time_desc_2 = time_desc.substring(0, time_desc.indexOf(':')).trim();
                                            switch (time_desc_2) {
                                                case 'Monday':
                                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                    var b = test_2.split(',');
                                                    if (b.length <= 3) {
                                                        for (var i = 0; i < b.length; i++) {
                                                            var b_v = b[i];
                                                            if (b_v.indexOf('–') >= 0) {
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
                                                            } else {
                                                                var vv_11 = '休息';
                                                            }
                                                        }
                                                        var desc_1 = vv_11;
                                                    } else {
                                                        var desc_1 = time_desc.replace(new RegExp("Monday:", "gm"), "").replace(/\s+/g, '');
                                                    }
                                                    item.value = '';
                                                    item.desc = desc_1;
                                                    break;
                                                case 'Tuesday':
                                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                    var b = test_2.split(',');
                                                    if (b.length <= 3) {
                                                        for (var i = 0; i < b.length; i++) {
                                                            var b_v = b[i];
                                                            if (b_v.indexOf('–') >= 0) {
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
                                                            } else {
                                                                var vv_11 = '休息';
                                                            }
                                                        }
                                                        var desc_1 = vv_11;
                                                    } else {
                                                        var desc_1 = time_desc.replace(new RegExp("Tuesday:", "gm"), "").replace(/\s+/g, '');
                                                    }
                                                    item.value = '';
                                                    item.desc = desc_1;
                                                    break;
                                                case 'Wednesday':
                                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                    var b = test_2.split(',');
                                                    if (b.length <= 3) {
                                                        for (var i = 0; i < b.length; i++) {
                                                            var b_v = b[i];
                                                            if (b_v.indexOf('–') >= 0) {
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
                                                            } else {
                                                                var vv_11 = '休息';
                                                            }
                                                        }
                                                        var desc_1 = vv_11;
                                                    } else {
                                                        var desc_1 = time_desc.replace(new RegExp("Wednesday:", "gm"), "").replace(/\s+/g, '');
                                                    }
                                                    item.value = '';
                                                    item.desc = desc_1;
                                                    break;
                                                case 'Thursday':
                                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                    var b = test_2.split(',');
                                                    if (b.length <= 3) {
                                                        for (var i = 0; i < b.length; i++) {
                                                            var b_v = b[i];
                                                            if (b_v.indexOf('–') >= 0) {
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
                                                            } else {
                                                                var vv_11 = '休息';
                                                            }
                                                        }
                                                        var desc_1 = vv_11;
                                                    } else {
                                                        var desc_1 = time_desc.replace(new RegExp("Thursday:", "gm"), "").replace(/\s+/g, '');
                                                    }
                                                    item.value = '';
                                                    item.desc = desc_1;
                                                    break;
                                                case 'Friday':
                                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                    var b = test_2.split(',');
                                                    if (b.length <= 3) {
                                                        for (var i = 0; i < b.length; i++) {
                                                            var b_v = b[i];
                                                            if (b_v.indexOf('–') >= 0) {
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
                                                            } else {
                                                                var vv_11 = '休息';
                                                            }
                                                        }
                                                        var desc_1 = vv_11;
                                                    } else {
                                                        var desc_1 = time_desc.replace(new RegExp("Friday:", "gm"), "").replace(/\s+/g, '');
                                                    }
                                                    item.value = '';
                                                    item.desc = desc_1;
                                                    break;
                                                case 'Saturday':
                                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                    var b = test_2.split(',');
                                                    if (b.length <= 3) {
                                                        for (var i = 0; i < b.length; i++) {
                                                            var b_v = b[i];
                                                            if (b_v.indexOf('–') >= 0) {
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
                                                            } else {
                                                                var vv_11 = '休息';
                                                            }
                                                        }
                                                        var desc_1 = vv_11;
                                                    } else {
                                                        var desc_1 = time_desc.replace(new RegExp("Saturday:", "gm"), "").replace(/\s+/g, '');
                                                    }
                                                    item.value = '';
                                                    item.desc = desc_1;
                                                    break;
                                                case 'Sunday':
                                                    var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                    var b = test_2.split(',');
                                                    if (b.length <= 3) {
                                                        for (var i = 0; i < b.length; i++) {
                                                            var b_v = b[i];
                                                            if (b_v.indexOf('–') >= 0) {
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
                                                            } else {
                                                                var vv_11 = '休息';
                                                            }
                                                        }
                                                        var desc_1 = vv_11;
                                                    } else {
                                                        var desc_1 = time_desc.replace(new RegExp("Sunday:", "gm"), "").replace(/\s+/g, '');
                                                    }
                                                    item.value = '';
                                                    item.desc = desc_1;
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

                                var attractions_en_2 = '';
                                var address_2 = '';
                                var telno_2 = '';
                                var lat_2 = '', lng_2 = '';
                                var website_2 = '';
                                if (typeof(address_1) != 'undefined') {
                                    address_2 = address_1;
                                }
                                if (typeof(attractions_en) != 'undefined') {
                                    attractions_en_2 = attractions_en;
                                }
                                if (typeof(telno_1) != 'undefined') {
                                    telno_2 = telno_1;
                                }
                                if (typeof(lng_1) != 'undefined') {
                                    lng_2 = lng_1;
                                }
                                if (typeof(lat_1) != 'undefined') {
                                    lat_2 = lat_1;
                                }
                                if (typeof(website) != 'undefined') {
                                    website_2 = website;
                                }
                                var loc = [];
                                loc.push(Number(lng_2));
                                loc.push(Number(lat_2));
                                if (attractions_en_2 != '') {
                                    dataID.attractions_en = attractions_en_2;
                                }
                                if (address_2 != '') {
                                    dataID.address = address_2;
                                }

                                if (opentime_1 != '') {
                                    dataID.periods = opentime_1;
                                }
                                if (opentime_desc != '') {
                                    dataID.open_time = opentime_desc;
                                }
                                if (website_2 != '') {
                                    dataID.website = website_2;
                                }
                                if (telno_2 != '') {
                                    dataID.telno = telno_2;
                                }
                                if (comments_content != '') {
                                    dataID.comments = comments_content;
                                }
                                if (comments_from != '') {
                                    dataID.comments_from = comments_from;
                                }
                                if (lat_2 != '') {
                                    dataID.latitude = lat_2;
                                }
                                if (lng_2 != '') {
                                    dataID.longitude = lng_2;
                                }
                                if (loc.length > 0) {
                                    dataID.loc = loc;
                                }

                                dataID.save(function (err) {
                                    call(null, "ok");
                                });

                            } else {
                                call(null, 'ok')
                            }
                        }
                    );
                });
                break;
            case '1':
                Restaurant.findOne({_id: poiID}, function (err, dataID) {
                    console.log(dataID);
                    googleInfoSpider.googlePlaceSpider(dataID.place_id, function (err, call_result) {
                        var resultData = JSON.parse(call_result);
                        if (call_result) {
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
                            var opentime_desc = [];
                            if (typeof(resultData_2.opening_hours) != 'undefined') {
                                if (resultData_2.opening_hours.periods) {
                                    opentime_1 = resultData_2.opening_hours.periods;
                                }
                                if (resultData_2.opening_hours.weekday_text) {
                                    for (var k = 0; k < resultData_2.opening_hours.weekday_text.length; k++) {
                                        //console.log( resultData_2.opening_hours.weekday_text[k]);
                                        var item = {};
                                        var time_desc = resultData_2.opening_hours.weekday_text[k];
                                        var time_desc_2 = time_desc.substring(0, time_desc.indexOf(':')).trim();
                                        switch (time_desc_2) {
                                            case 'Monday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Monday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Tuesday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Tuesday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Wednesday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Wednesday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Thursday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Thursday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Friday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Friday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Saturday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Saturday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Sunday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Sunday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
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
                            if (typeof(name_en) != 'undefined') {
                                dataID.name_en = name_en;
                            }
                            if (typeof(lat_1) != 'undefined') {
                                dataID.latitude = lat_1;
                            }
                            if (typeof(lng_1) != 'undefined') {
                                dataID.longitude = lng_1;
                            }
                            if (typeof(address_1) != 'undefined') {
                                dataID.address = address_1;
                            }
                            if (typeof(telno_1) != 'undefined') {
                                dataID.tel = telno_1;
                            }
                            if (typeof(opentime_1) != 'undefined') {
                                dataID.periods = opentime_1;
                            }
                            if (typeof(opentime_desc) != 'undefined') {
                                dataID.open_time = opentime_desc;
                            }
                            if (typeof(website) != 'undefined') {
                                dataID.website = website;
                            }
                            if (typeof(comments_from) != 'undefined') {
                                dataID.comments_from = comments_from;
                            }
                            if (typeof(comments_content) != 'undefined') {
                                dataID.comments = comments_content;
                            }
                            dataID.save(function (err) {
                                call(null, "ok");
                            });
                        } else {
                              call(null, "ok");
                        }
                    });
                });
                break;
            case '2':
                Shopping.findOne({_id: poiID}, function (err, dataID) {
                    googleInfoSpider.googlePlaceSpider(dataID.place_id, function (err, call_result) {
                        var resultData = JSON.parse(call_result);
                        if (call_result) {
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
                            var opentime_desc = [];
                            if (typeof(resultData_2.opening_hours) != 'undefined') {
                                if (resultData_2.opening_hours.periods) {
                                    opentime_1 = resultData_2.opening_hours.periods;
                                }
                                if (resultData_2.opening_hours.weekday_text) {
                                    for (var k = 0; k < resultData_2.opening_hours.weekday_text.length; k++) {
                                        //console.log( resultData_2.opening_hours.weekday_text[k]);
                                        var item = {};
                                        var time_desc = resultData_2.opening_hours.weekday_text[k];
                                        var time_desc_2 = time_desc.substring(0, time_desc.indexOf(':')).trim();
                                        switch (time_desc_2) {
                                            case 'Monday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Monday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Tuesday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Tuesday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Wednesday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Wednesday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Thursday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Thursday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Friday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Friday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Saturday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Saturday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
                                                break;
                                            case 'Sunday':
                                                var test_2 = time_desc.substring(time_desc.indexOf(':') + 2, time_desc.length);
                                                var b = test_2.split(',');
                                                if (b.length <= 3) {
                                                    for (var i = 0; i < b.length; i++) {
                                                        var b_v = b[i];
                                                        if (b_v.indexOf('–') >= 0) {
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
                                                        } else {
                                                            var vv_11 = '休息';
                                                        }
                                                    }
                                                    var desc_1 = vv_11;
                                                } else {
                                                    var desc_1 = time_desc.replace(new RegExp("Sunday:", "gm"), "").replace(/\s+/g, '');
                                                }
                                                item.value = '';
                                                item.desc = desc_1;
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
                            if (typeof(name_en) != 'undefined') {
                                dataID.name_en = name_en;
                            }
                            if (typeof(lat_1) != 'undefined') {
                                dataID.latitude = lat_1;
                            }
                            if (typeof(lng_1) != 'undefined') {
                                dataID.longitude = lng_1;
                            }
                            if (typeof(address_1) != 'undefined') {
                                dataID.address = address_1;
                            }
                            if (typeof(telno_1) != 'undefined') {
                                dataID.tel = telno_1;
                            }
                            if (typeof(opentime_1) != 'undefined') {
                                dataID.periods = opentime_1;
                            }
                            if (typeof(opentime_desc) != 'undefined') {
                                dataID.open_time = opentime_desc;
                            }
                            if (typeof(website) != 'undefined') {
                                dataID.website = website;
                            }
                            if (typeof(comments_from) != 'undefined') {
                                dataID.comments_from = comments_from;
                            }
                            if (typeof(comments_content) != 'undefined') {
                                dataID.comments = comments_content;
                            }
                            dataID.save(function (err) {
                                call(null, "ok");
                            });
                        } else {
                            call(null, 'ok');
                        }
                    });
                });
                break;
            case '3':
                Area.findOne({_id: poiID}, function (err, dataID) {
                    googleInfoSpider.googlePlaceSpider(dataID.place_id, function (err, call_result) {
                        var resultData = JSON.parse(call_result);
                        if (call_result) {
                            var resultData_2 = resultData.result;
                            if (resultData_2.formatted_address) {
                                var address_1 = resultData_2.formatted_address;
                            }
                            if (resultData_2.formatted_phone_number) {
                                var telno_1 = resultData_2.formatted_phone_number;
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
                            if (typeof(name_en) != 'undefined') {
                                dataID.area_enname = name_en;
                            }
                            if (typeof(address_1) != 'undefined') {
                                dataID.address = address_1;
                            }
                            if (typeof(lat_1) != 'undefined') {
                                dataID.latitude = lat_1;
                            }
                            if (typeof(lng_1) != 'undefined') {
                                dataID.longitude = lng_1;
                            }
                            if (typeof(website) != 'undefined') {
                                dataID.website = website;
                            }
                            if (typeof(telno_1) != 'undefined') {
                                dataID.tel = telno_1;
                            }
                            if (typeof(opentime_1) != 'undefined') {
                                dataID.periods = opentime_1;
                            }
                            if (typeof(comments_content) != 'undefined') {
                                dataID.comments = comments_content;
                            }
                            if (typeof(comments_from) != 'undefined') {
                                dataID.comments_from = comments_from;
                            }
                            dataID.save(function (err) {
                                call(err, "ok");
                            });
                        }
                    });
                });
                break;
            default:
                call(null, 'ok');
                break;
        }
    }
}
exports.poiInfo(process.argv[2], process.argv[3], process.argv[4], function (err, result) {//函数执行的入口
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

