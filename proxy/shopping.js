
var models = require('../models');
var Shopping = models.Shopping;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');
var googleInfo = require('../routes/googleInfoSpider');
exports.getShopping = function (id, callback) {
  Shopping.findOne({_id: id}, callback);
};
exports.findShoppings = function(query,callback) {
	Shopping.find(query, callback);
}
exports.findShopByName = function(query, callback){
	Shopping.findOne(query, callback);
}
exports.getFullShopping = function(id,callback){
	exports.getShopping(id, function(err,shopping){
	  	if(shopping){
	  		if(shopping.in_big_id){
	  			exports.getShopping(shopping.in_big_id, function(err2,one){
	  				if(one){
	  					shopping.in_big_name = one.name;
	  					callback(null,shopping);
	  				}
	  				else{
	  					callback(null,shopping);
	  				}
	  			});
	  		}else{
	  			callback(null,shopping);
	  		}
	  	}else{
	  		callback(err,shopping);
	  	}
    });
};

exports.getShoppings = function (skip,pageLimit,query, callback) {
	console.log(query);
  Shopping.find(query, [], {sort: [['city_name', 'asc'],['index_flag','desc'],['show_flag','desc'],['ranking', 'asc']],skip:skip, limit:pageLimit}, function (err, shoppings) {
		if(err)
			callback(err);
		else{
			callback(null,shoppings);
		}
	});
};

exports.getShoppingsByQuery = function(query,callback){
	Shopping.find(query, [], {sort: [['city_name', 'asc'],['index_flag','desc'],['show_flag','desc'],['ranking', 'asc']]}, function (err, shoppings) {
		if(err)
			callback(err);
		else{
			callback(null,shoppings);
		}
	});
};

exports.getShoppingsByOptions = function(query,options,callback){
	Shopping.find(query,[],options,callback);
};

exports.count = function (query,callback) {
  Shopping.count(query, callback);
};

exports.updateShowFlag = function(_id,show_flag,callback){
	exports.getShopping(_id,function(err,one){
		if(one){
			one.show_flag = show_flag;
			one.save(function(err2){
				callback(err2,one);
			});
		}else{
			callback(err,one);
		}
	});
};

exports.updatemsg = function(one, callback) {
	var _id = one._id;
	console.log(one);
	var comments = [];
		comments.push(one.comments);
	Shopping.update({'_id': new ObjectID(_id)},{$set:{
		name: one.name,
		city_name: one.city_name,
		city_id: one.city_id,
		latitude: one.latitude,
		longitude: one.longitude,
		address: one.address,
		// postal_code: postal_code,
		brief_introduce : one.brief_introduce,
		introduce: one.introduce,
		tips: one.tips,
		tel: one.tel,
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
		area_id: one.area_id,
		area_name: one.area_name,
		is_big: one.is_big,
		in_big_id: one.in_big_id,
		rating: one.rating,
		ranking: one.ranking,
		reviews: one.reviews,
		comments: one.comments,
		en_info: {
			introduce: one.en_info.introduce,
			tips: one.en_info.tips,
			comments: one.en_info.comments
		}
	}},callback)
}

exports.update = function(one,callback){
	exports.getShopping(new ObjectID(one._id+''),function(err,shopping){
		if(shopping){
			var comments = [];
			comments.push(one.comments);
			var loc = [];
			loc.push(Number(one.longitude));
			loc.push(Number(one.latitude));
			shopping.loc = loc;
			shopping.name = one.name;
			shopping.poi_sortType=one.poi_sortType,
				shopping.city_name = one.city_name;
			shopping.city_id = one.city_id;
			shopping.latitude = one.latitude;
			shopping.longitude = one.longitude;
			shopping.address = one.address;
			shopping.postal_code = one.postal_code;
			shopping.introduce = one.introduce;
			shopping.brief_introduce = one.brief_introduce;
			shopping.tips = one.tips;
			shopping.tel = one.tel;
			shopping.category = one.category;
			shopping.lifetag = one.lifetag;
			shopping.brand = one.brand;
			shopping.open_time = one.open_time;
			shopping.comments_top = one.comments_top;
			shopping.activities = one.activities;
			shopping.show_flag = one.show_flag;
			shopping.price_level = one.price_level;
			shopping.price_desc = one.price_desc;
			shopping.url = one.url;
			shopping.website = one.website;
			shopping.recommand_flag = one.recommand_flag;
			shopping.recommand_duration = one.recommand_duration;
			shopping.index_flag = one.index_flag;
			shopping.local_flag = one.local_flag;
			shopping.recommand_duration = one.recommand_duration;
			shopping.am = one.am;
			shopping.pm = one.pm;
			shopping.ev = one.ev;
			if(one.area_id){
				shopping.area_id = one.area_id;
				shopping.area_name = one.area_name;
			}
			shopping.is_big = one.is_big;
			if(one.in_big_id){
				shopping.in_big_id = one.in_big_id;
			}
			shopping.rating = one.rating;
			shopping.ranking = one.ranking;
			shopping.reviews = one.reviews;
			shopping.comments = comments;
			shopping.shoptags = one.shoptags;
			shopping.save(function(err){
				callback(err,shopping);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.updateAudit = function(one, callback){
	var _id = one.item_id;
	Shopping.update({_id: new ObjectID(_id)},{$set:{
		status : one.status,
		editorname : one.editorname,
		editdate : one.editdate,
		auditorname : one.auditorname,
		auditdate : one.auditdate 
	}},function(err, result){
		if(err){
			console.log("updateAudit err is==="+err);
		}
	})
};

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
			/*		if (resultData_2.formatted_phone_number) {
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
						var name_en = resultData_2.name;
					}
					if (resultData_2.website) {
						var website = resultData_2.website;
					}
					var opentime_1 = [];
					var opentime_desc= [];

					if (typeof(resultData_2.opening_hours) != 'undefined') {
						if (resultData_2.opening_hours.periods) {
							opentime_1 =resultData_2.opening_hours.periods;
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
						console.log('未抓取到营业时间');
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
					var shopping = new Shopping();
					//var comments = [];
					//comments.push(one.comments);
					shopping.name = one.name;
					shopping.type ='2';
					shopping.place_id =place_id;
					shopping.name_en =name_en;
					shopping.city_name = one.city_name;
					shopping.city_id = one.city_id;
					shopping.latitude =lat_1;
					shopping.longitude =lng_1;
					shopping.address = address_1;
					shopping.postal_code = one.postal_code;
					shopping.brief_introduce = one.brief_introduce;
					shopping.introduce = one.introduce;
					shopping.tips = one.tips;
					shopping.tel =telno_1;
					shopping.comments_from =comments_from;
					shopping.category = one.category;
					shopping.lifetag = one.lifetag;
					shopping.periods =opentime_1;
					shopping.open_time =opentime_desc;
					shopping.show_flag = one.show_flag;
					shopping.price_level = one.price_level;
					shopping.price_desc = one.price_desc;
					shopping.url = one.url;
					shopping.website = website;
					shopping.recommand_flag = one.recommand_flag;
					shopping.recommand_duration = one.recommand_duration;
					shopping.index_flag = one.index_flag;
					shopping.local_flag = one.local_flag;
					shopping.am = one.am;
					shopping.pm = one.pm;
					shopping.ev = one.ev;
					if(one.area_id){
						shopping.area_id = one.area_id;
						shopping.area_name = one.area_name;
					}
					shopping.is_big = one.is_big;
					if(one.in_big_id){
						shopping.in_big_id = one.in_big_id;
					}
					shopping.rating = one.rating;
					shopping.ranking = one.ranking;
					shopping.reviews = one.reviews;
					shopping.comments = comments_content;
					shopping.save(function (err) {
						callback(err, shopping);
					});
				}else{
					var shopping = new Shopping();
					//var comments = [];
					var name_en='';
					//comments.push(one.comments);
					shopping.name = one.name;
					shopping.place_id =place_id;
					shopping.type ='2';
					shopping.name_en =name_en;
					shopping.city_name = one.city_name;
					shopping.city_id = one.city_id;
					//shopping.latitude =lat_1;
					//shopping.longitude =lng_1;
					//shopping.address = address_1;
					shopping.postal_code = one.postal_code;
					shopping.brief_introduce = one.brief_introduce;
					shopping.introduce = one.introduce;
					shopping.tips = one.tips;
					//shopping.tel =telno_1;
					//shopping.comments_from =comments_from;
					shopping.category = one.category;
					shopping.lifetag = one.lifetag;
					//shopping.open_time =opentime_1;
					shopping.show_flag = one.show_flag;
					shopping.price_level = one.price_level;
					shopping.price_desc = one.price_desc;
					shopping.url = one.url;
					//shopping.website = website;
					shopping.recommand_flag = one.recommand_flag;
					shopping.recommand_duration = one.recommand_duration;
					shopping.index_flag = one.index_flag;
					shopping.local_flag = one.local_flag;
					shopping.am = one.am;
					shopping.pm = one.pm;
					shopping.ev = one.ev;
					if(one.area_id){
						shopping.area_id = one.area_id;
						shopping.area_name = one.area_name;
					}
					shopping.is_big = one.is_big;
					if(one.in_big_id){
						shopping.in_big_id = one.in_big_id;
					}
					shopping.rating = one.rating;
					shopping.ranking = one.ranking;
					shopping.reviews = one.reviews;
					//shopping.comments = comments_content;
					shopping.save(function (err) {
						callback(err, shopping);
					});

				}
			}
		);
	}
};
