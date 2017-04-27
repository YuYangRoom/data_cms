/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */
require('../config/Config');
var Tripurl = require('../proxy').TripUrl;
var logger4js = require('../utils/log').logger;
var AttractionsProvider = require("../config/AttractionsProvider").AttractionsProvider;
var attractionsProvider = new AttractionsProvider();
var BinaryProvider = require("../config/BinaryProvider.js").BinaryProvider;
var binaryProvider = new BinaryProvider();
var LabelProvider = require("../config/LabelProvider").LabelProvider;
var labelProvider = new LabelProvider();
var ObjectID = require('mongodb').ObjectID;
fs = require('fs');
var im = require('imagemagick');
im.identify.path = global.imIdentifyPath;
im.convert.path = global.imConvertPath;
var upyunClient = require('./upyun/upyunClient');
var Util = require('./util');
var attractions = require('../proxy').Attractions;
//var activity1 = require('../proxy').Activity;
var Activity = require('../models').Activity;
var googleInfoSpider = require('./googleInfoSpider');
var async = require('async');
exports.saveAttractions = function (req, res) {
   /* //var data = req.body;
    if (req.body.subLabel.length > 0) {
        var sub = [];
        for (var i = 0; i < req.body.subLabel.length; i++) {
            var _id = new ObjectID(req.body.subLabel[i]._id);
            var name = req.body.subLabel[i].name;
            sub.push({_id: _id, label: name});
        }
    }*/
/*    var masterNew_label = '';
    if (req.body.masterLabel.length != 0) {
        var master_test = req.body.masterLabel[1];
        if (master_test.length > 0) {
            masterNew_label = {_id: new ObjectID(req.body.masterLabel[0]), label: req.body.masterLabel[1]};
        }
    }*/
    //date.city_id = ObjectId(req.body.cityid);
    //date.masterLabelNew = {_id:ObjectID(req.body.masterLabel_id),label:req.body.masterLabel};
    //data.subLabel = sub;
    //data.createFlag = '0';
    //data.checkFlag = '1';
    //data.createPreson = 'weego';
    //data.random = Math.random();
    var loc = [];
    var place_id = req.body.place_id;
    if(place_id!=null&&place_id!=''){
    googleInfoSpider.googlePlaceSpider(place_id, function (err, call_result) {
             if (call_result) {
            var resultData = JSON.parse(call_result);
            var resultData_2 = resultData.result;
            if (resultData_2.formatted_address) {
                var address_1 = resultData_2.formatted_address;
            }
       /*     if (resultData_2.formatted_phone_number) {
                var telno_1 = resultData_2.formatted_phone_number;
            }*/
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
                 var opentime_desc= [];
                 if (typeof(resultData_2.opening_hours) != 'undefined') {
                if (resultData_2.opening_hours.periods) {
                    opentime_1= resultData_2.opening_hours.periods;
                }
                /*
                 "weekday_text":[
                 "Monday: 10:30 AM – 8:00 PM",
                 "Tuesday: 10:30 AM – 8:00 PM",
                 "Wednesday: 10:30 AM – 8:00 PM",
                 "Thursday: 10:30 AM – 8:00 PM",
                 "Friday: 10:30 AM – 8:00 PM",
                 "Saturday: 10:30 AM – 8:00 PM",
                 "Sunday: 10:30 AM – 8:00 PM"
                 ]
                * */
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
            //console.log(address_1 + '##' +'##'+telno_1+'##'+lat_1+'##'+lng_1+'##'+attractions_en+'\n'+ '##'+ '##'+place_id+'##'+website);
        }
        var attractions_en_2 = '';
        var address_2 = '';
        var telno_2 = '';
        var lat_2 = '', lng_2 = '';
        var website_2 = '';
        if (req.body.address) {
            address_2 = req.body.address;
        } else if (typeof(address_1) != 'undefined') {
            address_2 = address_1;
        }
        if (req.body.attractions_en) {
            attractions_en_2 = req.body.attractions_en;
        } else if (typeof(attractions_en) != 'undefined') {
            attractions_en_2 = attractions_en;
        }
        if (req.body.telno) {
            telno_2 = req.body.telno;
        } else if (typeof(telno_1) != 'undefined') {
            telno_2 = telno_1;
        }
        if (req.body.longitude) {
            lng_2 = req.body.longitude;
        } else if (typeof(lng_1) != 'undefined') {
            lng_2 = lng_1;
        }
        if (req.body.latitude) {
            lat_2 = req.body.latitude;
        } else if (typeof(lat_1) != 'undefined') {
            lat_2 = lat_1;
        }
        if (req.body.website) {
            website_2 = req.body.website;
        } else if (typeof(website) != 'undefined') {
            website_2 = website;
        }

        loc.push(Number(lng_2));
        loc.push(Number(lat_2));
        var setjson = {
            cityname: req.body.cityname,
            city_id: new ObjectID(req.body.cityid),
            cityid: new ObjectID(req.body.cityid),
            attractions: req.body.attractions,
            attractions_en: attractions_en_2,
            address: address_2,
            type: '0',
            place_id: place_id,
            price: req.body.price,
            periods: opentime_1,
            open_time: opentime_desc,
            traffic_info: req.body.traffic_info,
            tips: req.body.tips,
            dayornight: req.body.dayornight,
            website: website_2,
            comments_url: req.body.comments_url,
            telno: telno_2,
            comments: comments_content,
            comments_from: comments_from,
            activity: req.body.activity,
            introduce: req.body.introduce,
            short_introduce: req.body.short_introduce,
            recommand_duration: req.body.recommand_duration,
            recommand_reason: req.body.recommand_reason,
            recommand_flag: req.body.recommand_flag,
            show_flag: req.body.show_flag,
            index_flag: req.body.index_flag,
            am: req.body.am,
            pm: req.body.pm,
            ev: req.body.ev,
            //masterLabel_id: $("#masterLabel").attr('data-value'),
            //masterLabel: $("#masterLabel").attr('value')
            //subLabel: array_label,
            //subLabel_name: array_label_name
            latitude: lat_2,
            longitude: lng_2,
            createFlag: '0',
            checkFlag: '1',
            createPreson: 'weego',
            random: Math.random(),
            loc: loc,
            //masterLabelNew: masterNew_label,
            //subLabelNew: sub
        }

        attractionsProvider.insert(setjson, {safe: true}, function (err, result) {
            if (err) {
                console.log("AttractionsProvider.insert err: ", err);
                res.send({isSuccess: false, info: err});
            } else {
                //   console.log("userProvider.insert result: ", result);
                res.send({isSuccess: true, _id: result[0]._id, user_id: req.session.user._id});
            }
        });
        }
    );}

};
exports.getAllAttractions = function (req, res) {

    attractionsProvider.find({}, {}, function (err, result) {
        if (err) {
            console.log("AttractionsProvider.find err: ", err);
            res.send({err: err});
        } else {
            console.log("AttractionsProvider.find result: ", result);
            res.send(result);
        }
    });
};
exports.deleteAttractions = function (req, res) {
    attractionsProvider.remove({_id: new ObjectID(req.params.attractionsID)}, {}, function (err, result) {
        if (err) {
            console.log("userProvider.remove err: ", err);
            res.send({err: err});
        } else {
            console.log("userProvider.remove result: ", result);
            res.send({_id: req.params.attractionsID});
        }
    });
};
exports.getAllAttractionsByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var cityname = req.query.cityname;
    var attrname = req.query.attrname;
    var query = {checkFlag: '1'};
    if (!Util.isNull(cityname))
        query.cityname = cityname;
    if (!Util.isNull(attrname))
        query.attractions = {$regex: attrname};
    attractionsProvider.count(query, function (err, count) {
        attractionsProvider.find(query, {
            skip: skip,
            limit: req.params.pageLimit,
            sort: {'index_flag': -1, 'show_flag': -1, 'recommand_flag': -1}
        }, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({attractions: result, count: count});
            }
        });
    });
};
exports.getAllUserCreateAttractionsByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var name = req.params.name;
    if (name != '' && name !== undefined) {
        attractionsProvider.count({cityname: name, checkFlag: '0'}, function (err, count) {
            attractionsProvider.find({cityname: name, checkFlag: '0'}, {
                skip: skip,
                limit: req.params.pageLimit
            }, function (err, result) {
                if (err) {
                    res.send({err: err});
                } else {
                    res.send({attractions: result, count: count});
                }
            });
        });
    } else {
        attractionsProvider.count({checkFlag: '0'}, function (err, count) {
            attractionsProvider.find({checkFlag: '0'}, {
                skip: skip,
                limit: req.params.pageLimit
            }, function (err, result) {
                if (err) {
                    res.send({err: err});
                } else {
                    res.send({attractions: result, count: count});
                }
            });
        });
    }
};
exports.checkattractions = function (req, res) {
    attractionsProvider.update({_id: new ObjectID(req.params.attractionsID)}, {$set: {checkFlag: '1'}}, function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
function getSubLabel(label, sblabel, callback) {
    var _id = label;
    labelProvider.findOne({'_id': new ObjectID(_id)}, {'label': 1}, function (err, re) {
        if (err) {
            console.log(err);
        } else {
            if (re) {
                sblabel.push({'label': re.label, '_id': re._id});
                callback(sblabel);
            } else {
                callback(sblabel);
            }
        }

    });
}
function startTask(paramsArray, sblabel, current, count, callBack) {
    if (current >= count) {
        callBack(sblabel);
    } else {
        getSubLabel(paramsArray[current], sblabel, function (sblabel) {
            startTask(paramsArray, sblabel, current + 1, count, callBack);
        });
    }
}

exports.getAttractions = function (req, res) {
    if (req.params.attractionsID) {
        attractionsProvider.findOne({_id: new ObjectID(req.params.attractionsID)}, {}, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                if (result.masterLabel) {
                    labelProvider.findOne({_id: new ObjectID(result.masterLabel)}, {}, function (err, data) {
                        if (err) {

                        } else {
                            if (data) {
                                result.masterLabel = {'masterLabel': data.label, '_id': data._id};
                                var sblabel = [];
                                if (result.subLabel && result.subLabel.length) {
                                    startTask(result.subLabel, sblabel, 0, result.subLabel.length, function (sblabel) {
                                        result.subLabel = sblabel;
                                        res.send(result);
                                    });
                                } else {
                                    res.send(result);
                                }
                            } else {
                                res.send(result);
                            }
                        }

                    });
                } else {
                    res.send(result);
                }

            }
        });
    } else {
        attractionsProvider.find({}, {}, function (err, result) {
            if (err) {
                res.send({err: err});
                throw err;
            } else {
                res.send(result);
            }
        });
    }
};

exports.getAttractionsImage = function (req, res) {
    var imageID = req.params.imageId;
    if (imageID != 'undefined') {
        var path = global.imgpathAO + req.params.imageId;
        fs.exists(path, function (exists) {
            if (exists) {
                fs.readFile(path, "binary", function (err, data) {
                    if (err) {
                        res.end();
                        throw err;
                    } else {
                        if (data) {
                            res.write(data, "binary");
                            res.end();
                        } else {
                            res.end();
                        }
                    }
                });
            } else {
                res.end();
            }
        });
    } else {
        res.end();
    }
};
exports.postattr = function (req, res) {
    var target_upload_name;
    var desc = req.body._desc;
    var title = req.body._title;
    var advice = req.body._advice
    // console.log(req.files.file.path);
    // console.log(req.files.file.type);
    // console.log(req.body._id);
    var _id = req.body._id || req.headers._id;
    if (req.files.file && _id) {
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathAO + target_upload_name;
        var filePathA1 = global.imgpathA1 + target_upload_name;
        console.log(tmp_upload_path, target_upload_path);
        makeImageFile1(req, tmp_upload_path, target_upload_path, function () {
            upyunClient.upAttractionToYun1(target_upload_name, function (err, data) {
                if (err) throw err;
                attractionsProvider.update({_id: new ObjectID(_id)}, {
                    $push: {
                        'spot': {
                            'cover_image': target_upload_name,
                            'title': title,
                            'desc': desc,
                            'advice': advice
                        }
                    }
                }, {safe: true}, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.json(target_upload_name);
                        res.end();
                    }
                });
            });
        });
    } else {
        res.end();
    }
}
exports.post_attr = function (req, res) {
    var target_upload_name;
    //var desc = req.body._desc;
    //var title = req.body._title;
    //var advice = req.body._advice
    // console.log(req.files.file.path);
    // console.log(req.files.file.type);
    // console.log(req.body._id);
    var _id = req.body._id || req.headers._id;
    if (req.files.file && _id) {
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathAO + target_upload_name;
        var filePathA1 = global.imgpathA1 + target_upload_name;
        console.log(tmp_upload_path, target_upload_path);
        makeImageFile1(req, tmp_upload_path, target_upload_path, function () {
            upyunClient.upAttractionToYun1(target_upload_name, function (err, data) {
                if (err) throw err;
                attractionsProvider.update({_id: new ObjectID(_id)},
                    {
                    $push: {'image': target_upload_name}
                },
                    {safe: true}, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.json(target_upload_name);
                        res.end();
                    }
                });
            });
        });
    } else {
        res.end();
    }
}
exports.postimage = function (req, res) {
    var target_upload_name;
    // console.log(req.files.file.path);
    // console.log(req.files.file.type);
    // console.log(req.body._id);
    var _id = req.body._id || req.headers._id;
    if (req.files.file && _id) {
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathAO + target_upload_name;
        var filePathA1 = global.imgpathA1 + target_upload_name;
        var filePathA2 = global.imgpathA2 + target_upload_name;
        var filePathA3 = global.imgpathA3 + target_upload_name;
        var filePathA4 = global.imgpathA4 + target_upload_name;
        var filePathA5 = global.imgpathA5 + target_upload_name;
        console.log(tmp_upload_path, target_upload_path);
        makeImageFile(req, tmp_upload_path, target_upload_path, filePathA1, filePathA2, filePathA3, filePathA4, filePathA5, function () {

            upyunClient.upAttractionToYun(target_upload_name, function (err, data) {
                if (err) throw err;
                attractionsProvider.update({_id: new ObjectID(_id)}, {$push: {'image': target_upload_name}}, {safe: true}, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.json(target_upload_name);
                        res.end();
                    }
                });
            });
        });
    } else {
        res.end();
    }
    //原来的方法如下
    // if (req.files.upload && req.body._id) {
    //     var id = new ObjectID();
    //     var tmp_upload = req.files.upload;
    //     var tmp_upload_path = tmp_upload.path;
    //     var tmp_upload_type = tmp_upload.type;
    //     target_upload_name = validPic(tmp_upload_type);
    //     var target_upload_path = global.imgpathAO + target_upload_name;
    //     var filePathA1 = global.imgpathA1 + target_upload_name;
    //     var filePathA2 = global.imgpathA2 + target_upload_name;
    //     var filePathA3 = global.imgpathA3 + target_upload_name;
    //     var filePathA4 = global.imgpathA4 + target_upload_name;
    //     var filePathA5 = global.imgpathA5 + target_upload_name;
    //     makeImageFile(req, tmp_upload_path, target_upload_path, filePathA1, filePathA2, filePathA3,filePathA4,filePathA5, function () {
    //         upyunClient.upAttractionToYun(target_upload_name,function(err,data){
    //             if(err) throw err;
    //             attractionsProvider.update({_id:new ObjectID(req.body._id)}, {$push:{ 'image':target_upload_name}}, {safe:true}, function (err) {
    //                 if (err) {
    //                     throw err;
    //                 } else {
    //                     res.setHeader("Content-Type", "application/json");
    //                     res.json(target_upload_name);
    //                     res.end();
    //                 }
    //             });
    //         });
    //     });
    // } else {
    //     res.end();
    // }
};
function makeImageFile1(req, tmp_path, target_path, callback) {
    fs.rename(tmp_path, target_path, function (err) {
        if (err) {
            throw err;
        }
        process.nextTick(callback);
    });
};
function makeImageFile(req, tmp_path, target_path, target_path_A1, target_path_A2, target_path_A3, target_path_A4, target_path_A5, callback) {
    fs.rename(tmp_path, target_path, function (err) {
        if (err) {
            throw err;
        }
        fs.unlink(tmp_path, function () {
            if (err) throw err;

            im.crop({
                srcPath: target_path,
                dstPath: target_path_A1,
                width: global.imgsizeA1.width,
                height: global.imgsizeA1.height,
                quality: 1,
                gravity: 'Center'
            }, function (err, metadata) {
                if (err) throw err;
                im.crop({
                    srcPath: target_path,
                    dstPath: target_path_A2,
                    width: global.imgsizeA2.width,
                    height: global.imgsizeA2.height,
                    quality: 1,
                    gravity: 'Center'
                }, function (err, metadata) {
                    if (err) throw err;
                    im.crop({
                        srcPath: target_path,
                        dstPath: target_path_A3,
                        width: global.imgsizeA3.width,
                        height: global.imgsizeA3.height,
                        quality: 1,
                        gravity: 'Center'
                    }, function (err, metadata) {
                        if (err) throw err;
                        im.crop({
                            srcPath: target_path,
                            dstPath: target_path_A4,
                            width: global.imgsizeA4.width,
                            height: global.imgsizeA4.height,
                            quality: 1,
                            gravity: 'Center'
                        }, function (err, metadata) {
                            if (err) throw err;
                            im.crop({
                                srcPath: target_path,
                                dstPath: target_path_A5,
                                width: global.imgsizeA5.width,
                                height: global.imgsizeA5.height,
                                quality: 1,
                                gravity: 'Center'
                            }, function (err, metadata) {
                                if (err) throw err;
                                process.nextTick(callback);
                            });
                        });
                    });
                });
            });
        });
    });
};
function validPic(type) {
    var suffix = type.split('/')[1];
    var _id = new ObjectID();
    return _id + '.' + suffix;
}
exports.UpdateUploadAttr = function (req, res) {
    var imageName = req.body.name;
    var _id = req.body._id;
    var desc = req.body.desc;
    var title = req.body.title;
    var advice = req.body.advice;
    pullAttr(_id, imageName, function (err) {
        if (err)res.send({'status': 'fail'});
        attractionsProvider.update({_id: new ObjectID(_id)}, {
            $push: {
                'spot': {
                    'cover_image': imageName,
                    'title': title,
                    'desc': desc,
                    'advice': advice
                }
            }
        }, {safe: true}, function (err) {
            if (err) res.send({'status': 'fail'});
            res.send({'status': 'success'});
        });
    });
}
exports.delUploadAttr = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    fs.unlink(global.imgpathAO + imageName, function () {
        fs.unlink(global.imgpathA1 + imageName, function () {
            pullAttr(_id, imageName, function (err) {
                if (err) throw err;
                upyunClient.delAttractionFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    });
}
function pullAttr(_id, target_upload_name, callback) {

    attractionsProvider.findOne({_id: new ObjectID(_id)}, {}, function (err, result) {
        if (err) {
            throw err;
        } else {
            if (result) {
                var tmp = result.spot
                i = tmp.length
                pic = -1;
                while (i--) {
                    if (tmp[i].cover_image == target_upload_name) {
                        pic = i;
                    }
                }
                if (pic != -1) {
                    attractionsProvider.update({_id: new ObjectID(_id)}, {$pull: {'spot': result.spot[pic]}}, {}, callback);
                }
            }
        }
    });

}
exports.delUploadImage = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    fs.unlink(global.imgpathAO + imageName, function () {
        fs.unlink(global.imgpathA1 + imageName, function () {
            fs.unlink(global.imgpathA2 + imageName, function () {
                fs.unlink(global.imgpathA3 + imageName, function () {
                    fs.unlink(global.imgpathA4 + imageName, function () {
                        fs.unlink(global.imgpathA5 + imageName, function () {
                            attractionsProvider.update({_id: new ObjectID(_id)}, {$pull: {'image': imageName}}, {safe: true}, function (err) {
                                if (err) throw err;
                                upyunClient.delAttractionFromYun(imageName, function (err, data) {
                                    if (err) res.send({'status': 'fail'});
                                    res.send({'status': 'success'});
                                });
                            });
                        });
                    });
                });
            });
        });
    });

};
//废弃
function copyCoverImage(globalpath, strpath, despath, callback) {
    var fileReadStream = fs.createReadStream(globalpath + strpath);
    var fileWriteStream = fs.createWriteStream(globalpath + despath);
    fileReadStream.pipe(fileWriteStream);
    fileWriteStream.on('close', function () {
        callback();
    });
}
exports.setCoverImg = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    attractionsProvider.update({_id: new ObjectID(_id)}, {
        $set: {
            'coverImageName': imageName,
            "imgFlag": true
        }
    }, {safe: true}, function (err) {
        if (err) {
            throw err;
        } else {
            res.setHeader("Content-Type", "application/json");
            res.json(imageName);
            res.end();
        }
    });
    // attractionsProvider.findOne({_id:new ObjectID(_id), 'coverImageName':{$exists:true}}, {}, function (err, result) {
    //     if (err) {
    //         throw err;
    //     } else {
    //         if (result) {
    //             copyCoverImage(global.imgpathAO, imageName, result.coverImageName, function () {
    //                 copyCoverImage(global.imgpathA1, imageName, result.coverImageName, function () {
    //                     copyCoverImage(global.imgpathA2, imageName, result.coverImageName, function () {
    //                         copyCoverImage(global.imgpathA3, imageName, result.coverImageName, function () {
    //                             copyCoverImage(global.imgpathA4, imageName, result.coverImageName, function () {
    //                                 copyCoverImage(global.imgpathA5, imageName, result.coverImageName, function () {
    //                                     res.setHeader("Content-Type", "application/json");
    //                                     res.json(result.coverImageId);
    //                                     res.end();
    //                                 });
    //                             });
    //                         });
    //                     });
    //                 });
    //             });
    //         } else {
    //             var suffix = imageName.split(".")[1];
    //             var cover_id = new ObjectID();
    //             var cover_name = cover_id + '.' + suffix;
    //             copyCoverImage(global.imgpathAO, imageName, cover_name, function () {
    //                 copyCoverImage(global.imgpathA1, imageName, cover_name, function () {
    //                     copyCoverImage(global.imgpathA2, imageName, cover_name, function () {
    //                         copyCoverImage(global.imgpathA3, imageName, cover_name, function () {
    //                             copyCoverImage(global.imgpathA4, imageName, cover_name, function () {
    //                                 copyCoverImage(global.imgpathA5, imageName, cover_name, function () {
    //                                     attractionsProvider.update({_id:new ObjectID(_id)}, {$set:{'coverImageName':cover_name, "imgFlag":true}}, {safe:true}, function (err) {
    //                                         if (err) {
    //                                             throw err;
    //                                         } else {
    //                                             res.setHeader("Content-Type", "application/json");
    //                                             res.json(cover_name);
    //                                             res.end();
    //                                         }
    //                                     });
    //                                 });
    //                             });
    //                         });
    //                     });
    //                 });
    //             });
    //         }
    //     }
    // });
};
exports.updateAttractions = function (req, res) {
    var tripid = req.body._id;
    var type ='0';
    var tripurl = req.body.comments_url;
    if (tripurl.indexOf('Attraction_Review') > 0) {
        logger4js.info('tripurl:' + tripurl + '#' + tripid + '#' + type);
        //console.log('tripurl:' + tripurl + '# tripid: ' + tripid + '#  :' + type);
        Tripurl.tripwebUrl(tripid, type, tripurl, function (err, result) {
            if (err) {
                console.log(err);
                process.exit();
            }
            process.exit();
        });
    }
    var data = req.body;
    //if (data.subLabel.length > 0) {
    //    var sub = [];
    //    for (var i = 0; i < data.subLabel.length; i++) {
    //        sub.push(data.subLabel[i]);
    //    }
    //}
    if (req.body.subLabel.length > 0) {
        var sub = [];
        var sub_child = [];
        for (var i = 0; i < req.body.subLabel.length; i++) {
            sub_child.push(req.body.subLabel[i]._id);
            var _id = new ObjectID(req.body.subLabel[i]._id);
            var name = req.body.subLabel[i].name;
            //console.log(_id+'#####'+name);
            sub.push({_id: _id, label: name});


        }

    }
    if (req.body.activities.length > 0) {
        for (var i = 0; i < req.body.activities.length; i++) {
            var _id = new ObjectID(req.body.activities[i]._id);
            Activity.findOne({_id: _id}, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result) {
                        if (typeof(result.longitude) == 'undefined' && req.body.longitude && req.body.latitude) {
                            result.latitude = req.body.latitude;
                            result.longitude = req.body.longitude;
                            result.save(function (err, data) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    }
                }

            });
        }
    }
    var masterNew_label2 = '';
    var masvalue = '';
    if (req.body.masterLabel.length != 0) {
        var mastervalue = req.body.masterLabel[1].trim();
        if (mastervalue.length > 0) {
            masterNew_label2 = {_id: new ObjectID(req.body.masterLabel[0]), label: req.body.masterLabel[1]};
            masvalue = req.body.masterLabel[0];
        }
    }
    var loc = [];
    loc.push(Number(req.body.longitude));
    loc.push(Number(req.body.latitude));
    //data.subLabel = sub;
    data.createFlag = '0';
    var cityID='';
    if(req.body.cityid!=''){
        cityID=new ObjectID((req.body.cityid));
    }else if(req.body.city_id!=''){
        cityID=new ObjectID((req.body.city_id))
    }
    //console.log(req.body.cityid+'######'+req.body.city_id);
      var yelp_rating = req.body.yelp_rating;
      var yelp_rating_2=Number(yelp_rating);

    var setJson = {
        cityname: req.body.cityname,
        city_id:cityID ,
        cityid:cityID,
        attractions_en: req.body.attractions_en,
        address: req.body.address,
        price: req.body.price,
        opentime: req.body.opentime,
        dayornight: req.body.dayornight,
        website: req.body.website,
        attractions_sortType: req.body.attractions_sortType,
        telno: req.body.telno,
        activity: req.body.activity,
        attractions: req.body.attractions,
        introduce: req.body.introduce,
        tips: req.body.tips,
        yelp_rating:yelp_rating_2,
        short_introduce: req.body.short_introduce,
        recommand_flag: req.body.recommand_flag,
        recommand_duration: req.body.recommand_duration,
        recommand_reason: req.body.recommand_reason,
        traffic_info: req.body.traffic_info,
        show_flag: Number(req.body.show_flag),
        index_flag: req.body.index_flag,
        //masterLabel:req.body.masterLabel,
        //masterLabelNew:req.body.masterLabelNew,
        //subLabel:data.subLabel,
        //subLabelNew:req.body.subLabelNew,
        comments_top: req.body.comments_top,
        activities: req.body.activities,
        //comments_url:req.body.comments_url,
        masterLabelNew: masterNew_label2,
        masterLabel: masvalue,
        subLabelNew: sub,
        subLabel: sub_child,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        loc: loc,
        am: req.body.am,
        pm: req.body.pm,
        ev: req.body.ev,
        createFlag: '0'
    };
    console.log(req.params.attractionsID);
    attractionsProvider.update({_id: new ObjectID(req.params.attractionsID)}, {$set: setJson}, {safe: true}, function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true, _id: req.params.attractionsID, user_id: req.session.user._id});
        }
    });
};

exports.upload = function (req, res) {
    var attractions_id = req.query.attractions_id;
    var imageID = new ObjectID();
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var imageName = imageID + '.' + fileExtention;
    var filePath = global.imgpathAO + imageName;
    var fileStream = fs.createWriteStream(filePath);
    var filePathA1 = global.imgpathA1 + imageName;
    var filePathA2 = global.imgpathA2 + imageName;
    var filePathA3 = global.imgpathA3 + imageName;
    var filePathA4 = global.imgpathA4 + imageName;
    var filePathA5 = global.imgpathA5 + imageName;
    req.pipe(fileStream);
    req.on('end', function () {

        im.crop({
            srcPath: filePath,
            dstPath: filePathA1,
            width: global.imgasizeA1.width,
            height: global.imgasizeA1.height,
            quality: 1,
            gravity: 'Center'
        }, function (err, metadata) {
            if (err) throw err;
        });
        im.crop({
            srcPath: filePath,
            dstPath: filePathA2,
            width: global.imgasizeA2.width,
            height: global.imgasizeA2.height,
            quality: 1,
            gravity: 'Center'
        }, function (err, metadata) {
            if (err) throw err;
        });
        im.crop({
            srcPath: filePath,
            dstPath: filePathA3,
            width: global.imgasizeA3.width,
            height: global.imgasizeA3.height,
            quality: 1,
            gravity: 'Center'
        }, function (err, metadata) {
            if (err) throw err;
        });
        im.crop({
            srcPath: filePath,
            dstPath: filePathA4,
            width: global.imgasizeA4.width,
            height: global.imgasizeA4.height,
            quality: 1,
            gravity: 'Center'
        }, function (err, metadata) {
            if (err) throw err;
        });
        im.crop({
            srcPath: filePath,
            dstPath: filePathA5,
            width: global.imgasizeA5.width,
            height: global.imgasizeA5.height,
            quality: 1,
            gravity: 'Center'
        }, function (err, metadata) {
            if (err) throw err;
        });

        attractionsProvider.findOne({
            _id: new ObjectID(attractions_id),
            'coverImageId': null
        }, {}, function (err, result) {
            if (err) {
                throw err;
            } else {
                if (result) {
                    attractionsProvider.update({_id: new ObjectID(attractions_id)}, {
                        $push: {'image': imageName},
                        $set: {'coverImageName': imageName, "imgFlag": true}
                    }, {safe: true}, function (err, result) {
                        if (err) {
                            res.send({success: false});
                            throw err;
                        } else {
                            res.send({success: true});
                        }
                    });

                } else {
                    attractionsProvider.update({_id: new ObjectID(attractions_id)}, {$push: {'image': imageName}}, {safe: true}, function (err, result) {
                        if (err) {
                            res.send({success: false});
                            throw err;
                        } else {
                            res.send({success: true});
                        }
                    });
                }
            }
        });

    });
};

exports.getAttractionsByLabelID = function (req, res) {
    attractionsProvider.find({
        masterLabel: req.params.labelID,
        cityname: req.params.cityName
    }, {}, function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};

exports.addMasterLabelToAttractions = function (req, res) {
    var data = req.body;
    var labelId = data.labelId + '';
    var attractionsList = data.attractionsList;
    stringToObject(attractionsList, function (new_id) {
        attractionsProvider.update({_id: {$in: new_id}}, {$set: {masterLabel: labelId}}, {
            safe: true,
            multi: true
        }, function (err) {
            if (err) throw err;
            res.send('issuccess', true);
        });
    });
};
function stringToObject(strings, callback) {
    var new_id = [];
    for (var i = 0; i < strings.length; i++) {
        new_id.push(new ObjectID(strings[i]));
        if (i == strings.length - 1) {
            callback(new_id)
        }
    }
}
exports.addSubLabelToAttractions = function (req, res) {
    var data = req.body;
    var labelIds = data.labelIds;
    var attractionsList = data.attractionsList;
    stringToObject(attractionsList, function (new_id) {
        attractionsProvider.update({_id: {$in: new_id}}, {$set: {subLabel: labelIds}}, {
            safe: true,
            multi: true
        }, function (err) {
            if (err) throw err;
            res.send('issuccess', true);
        });
    });
};

exports.getAttractionsByQuery = function (query, option, callback) {
    attractionsProvider.find(query, option, callback);
};

exports.countByQuery = function (query, callback) {
    attractionsProvider.count(query, callback);
};

exports.publishAttraction = function (_id, callback) {
    attractionsProvider.update({_id: _id}, {$set: {show_flag: '1'}}, {
        safe: true,
        multi: true
    }, function (err, new_one) {
        if (err) callback(err);
        else callback(null, new_one);
    });
};

