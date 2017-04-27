var models = require('../models');
var Entertainment = models.Entertainment;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getEntertainment = function (id, callback) {
  Entertainment.findOne({_id: id}, callback);
};

exports.getEntertainments = function (skip,pageLimit,query, callback) {
  Entertainment.find(query, [], {sort: [['city_name', 'asc'],['index_flag','desc'],['show_flag','desc'],['ranking', 'asc']],skip:skip, limit:pageLimit}, function (err, entertainments) {
		if(err)
			callback(err);
		else{
			callback(null,entertainments);
		}
	});
};


exports.count = function (query,callback) {
  Entertainment.count(query, callback);
};

exports.updateShowFlag = function(_id,show_flag,callback){
	exports.getEntertainment(_id,function(err,one){
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

exports.update = function(one,callback){
	exports.getEntertainment(new ObjectID(one._id+''),function(err,entertainment){
		if(entertainment){
			var comments = [];
			comments.push(one.comments);
			entertainment.name = one.name;
			entertainment.city_name = one.city_name;
			entertainment.city_id = one.city_id;
			entertainment.latitude = one.latitude;
			entertainment.longitude = one.longitude;
			entertainment.address = one.address;
			entertainment.postal_code = one.postal_code;
			entertainment.introduce = one.introduce;
			entertainment.tips = one.tips;
			entertainment.tel = one.tel;
			entertainment.category = one.category;
			entertainment.lifetag = one.lifetag;
			entertainment.open_time = one.open_time;
			entertainment.show_flag = one.show_flag;
			entertainment.price_level = one.price_level;
			entertainment.price_desc = one.price_desc;
			entertainment.url = one.url;
			entertainment.website = one.website;
			entertainment.recommand_flag = one.recommand_flag;
			entertainment.recommand_duration = one.recommand_duration;
			entertainment.index_flag = one.index_flag;
			entertainment.local_flag = one.local_flag;
			entertainment.am = one.am;
			entertainment.pm = one.pm;
			entertainment.ev = one.ev;
			if(one.area_id){
				entertainment.area_id = one.area_id;
				entertainment.area_name = one.area_name;
			}
			entertainment.rating = one.rating;
			entertainment.ranking = one.ranking;
			entertainment.reviews = one.reviews;
			entertainment.comments = comments;

			entertainment.save(function(err){
				callback(err,entertainment);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.newAndSave = function(one,callback){
	var entertainment = new Entertainment();
	var comments = [];
	comments.push(one.comments);
	entertainment.name = one.name;
	entertainment.city_name = one.city_name;
	entertainment.city_id = one.city_id;
	entertainment.latitude = one.latitude;
	entertainment.longitude = one.longitude;
	entertainment.address = one.address;
	entertainment.postal_code = one.postal_code;
	entertainment.introduce = one.introduce;
	entertainment.tips = one.tips;
	entertainment.tel = one.tel;
	entertainment.category = one.category;
	entertainment.lifetag = one.lifetag;
	entertainment.open_time = one.open_time;
	entertainment.show_flag = one.show_flag;
	entertainment.price_level = one.price_level;
	entertainment.price_desc = one.price_desc;
	entertainment.url = one.url;
	entertainment.website = one.website;
	entertainment.recommand_flag = one.recommand_flag;
	entertainment.recommand_duration = one.recommand_duration;
	entertainment.index_flag = one.index_flag;
	entertainment.local_flag = one.local_flag;
	entertainment.am = one.am;
	entertainment.pm = one.pm;
	entertainment.ev = one.ev;
	if(one.area_id){
		entertainment.area_id = one.area_id;
		entertainment.area_name = one.area_name;
	}
	entertainment.rating = one.rating;
	entertainment.ranking = one.ranking;
	entertainment.reviews = one.reviews;
	entertainment.comments = comments;
	entertainment.save(function (err) {
		callback(err, entertainment);
	});
};
