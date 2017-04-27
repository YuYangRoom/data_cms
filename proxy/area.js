var models = require('../models');
var Area = models.Area;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');
var googleInfo = require('../routes/googleInfoSpider');
exports.getArea = function (id, callback) {
  Area.findOne({_id: id}, callback);
};

exports.getAreasByQuery = function(query,callback){
	Area.find(query, [], {sort: [['name', 'desc']],limit:10}, function (err, areas) {
		if(err)
			callback(err);
		else{
			callback(null,areas);
		}
	});
};

exports.getAreasByName = function(query, callback){
	Area.findOne(query,callback);
}
exports.getAreasByLimit = function (skip,pageLimit, callback) {
  Area.find({}, [], {sort: [['name', 'desc']],skip:skip, limit:pageLimit}, function (err, areas) {
		if(err)
			callback(err);
		else{
			callback(null,areas);
		}
	});
};

exports.count = function (query, callback) {
  Area.count(query, callback);
};

exports.pushImg = function(_id, filename, callback) {
	Area.update({_id: _id},{$push:{image:filename}},callback);
};

exports.pullImg = function(_id, filename, callback) {
	Area.update({_id: _id},{$pull: {image: filename}}, callback);
};

exports.setAreaCoverImg = function(_id, filename, callback) {
	Area.update({_id: _id},{$set:{cover_image: filename}}, callback);
}

exports.update = function(one,callback){
	//console.log(one);
	exports.getArea(new ObjectID(one._id+''),function(err,result){
		if(result){
			result.city_id = new ObjectID(one.city_id+'');
			result.city_name = one.city_name;
			result.area_name = one.area_name;
			result.area_enname = one.area_enname;
			result.area_introduce = one.area_introduce;
			result.address = one.address;
			result.latitude = one.latitude;
			result.longitude = one.longitude;
			result.cover_image = one.cover_image;
			result.traffic = one.traffic;
			result.tips = one.tips;
			result.brief_introduce = one.brief_introduce;
			result.address = one.address;
			result.tel = one.tel;
			result.website = one.website;
			result.open_time = one.open_time;
			result.tags = one.tags;
			result.shoptags = one.shoptags;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!');
		}
	});
};
exports.updatemsg = function(one, callback) {
	console.log(one);
	Area.update({_id: new ObjectID(one._id)},{$set:{
			area_name :one.area_name,
			area_enname :one.area_enname,
			area_introduce :one.area_introduce,
			city_id: one.city_id,
			city_name: one.city_name,
			cover_image: '5327c20da71a2a9415000001.jpg',
			address :one.address,
			latitude :one.latitude,
			longitude :one.longitude,
			traffic : one.traffic,
			tips : one.tips,
			address : one.address,
			tel : one.tel,
			website : one.website,
			open_time : one.open_time,
			tags : one.tags,
		shoptags : one.shoptags,
			en_info : {
				introduce: one.en_info.introduce,
				address: one.en_info.address
			}
	}},callback)
}
exports.updateAudit = function(one, callback){
	Area.update({area_name: one.name},{$set:{
		status : one.status,
		editorname : one.editorname,
		editdate : one.editdate?one.editdate:'',
		auditorname : one.auditorname,
		auditdate : one.auditdate?one.auditdate:''
	}},function(err, result){
		console.log(err);
	})
}

exports.newAndSave = function(one,callback){
	var place_id = one.place_id;
	if (place_id != null && place_id != '') {
		googleInfo.googlePlaceSpider(place_id, function (err, call_result) {
			if (call_result) {
				var resultData = JSON.parse(call_result);
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
/*				var opentime_1 = [];
				if (typeof(resultData_2.opening_hours) != 'undefined') {
					if (resultData_2.opening_hours.periods) {
				     opentime_1= resultData_2.opening_hours.periods;
					/!*
					for (var i = 0; i < resultData_2.opening_hours.weekday_text.length; i++) {
							var item = {};
							item.value = resultData_2.opening_hours.weekday_text[i];
							opentime_1.push(item);
						}*!/
					}
				} else {
					console.log('未抓取到营业时间');
				}*/
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
				//边界
				var area = new Area();
				area.type ='3';
				area.place_id =place_id;
				area.city_id = new ObjectID(one.city_id+'');
				area.city_name = one.city_name;
				area.area_name = one.area_name;
				area.area_enname = name_en;
				area.area_introduce = one.area_introduce;
				area.address = address_1;
				area.latitude = lat_1;
				area.longitude = lng_1;
				area.website = website;
				area.cover_image = one.cover_image;
				area.traffic = one.traffic;
				area.tips = one.tips;
				area.brief_introduce = one.brief_introduce;
				area.address = one.address;
				area.tel = telno_1;
				//area.website = one.website;
				area.tags = one.tags;
				area.shoptags = one.shoptags;
				//area.periods =opentime_1;
				area.comments = comments_content;
				area.comments_from = comments_from;
				area.save(function (err) {
					callback(err, area);
				});


			}else{
				var area = new Area();
				var name_en='';
				area.city_id = new ObjectID(one.city_id+'');
				area.city_name = one.city_name;
				area.place_id = place_id;
				area.area_name = one.area_name;
				area.type ='3';
				area.area_enname = name_en;
				area.area_introduce = one.area_introduce;
				//area.address = address_1;
				//area.latitude = lat_1;
				//area.longitude = lng_1;
				//area.website = website;
				area.cover_image = one.cover_image;
				area.traffic = one.traffic;
				area.tips = one.tips;
				area.brief_introduce = one.brief_introduce;
				area.address = one.address;
				//area.tel = telno_1;
				//area.website = one.website;
				area.tags = one.tags;
				area.shoptags = one.shoptags;
				//area.open_time = one.open_time;
				//area.comments = comments_content;
				//area.comments_from = comments_from;
				area.save(function (err) {
					callback(err, area);
				});
			}
		});
	}

};
