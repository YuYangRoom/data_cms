var models = require('../models');
var RecommendTime = models.RecommendTime;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
exports.getRecommendTime = function (id, callback) {
	RecommendTime.findOne({_id: id}, callback);
};

exports.getRecommendTimeByEnName = function (title, callback) {
	RecommendTime.findOne({title: title}, callback);
};

exports.getRecommendTimesByTypeLimit = function (type,skip,pageLimit, callback) {
	RecommendTime.find({}, [], {sort: [['title',  'desc']],skip:skip, limit:pageLimit}, function (err, recommendTimes) {
		if(err)
			callback(err);
		else{
			callback(null,recommendTimes);
		}
	});
};
exports.getrecommendTimeByQuery = function(query,callback){
	RecommendTime.find(query, [], {sort: [['title', 'desc']],limit:10}, function (err, recommendTimes) {
		if(err)
			callback(err);
		else{
			callback(null,recommendTimes);
		}
	});
};
exports.getRecommendTimesByType = function(type,callback){
	RecommendTime.find({type: type}, [], {sort: [['title', 'desc']]}, function (err, recommendTimes) {
		if(err)
			callback(err);
		else{
			callback(null,recommendTimes);
		}
	});
};
exports.getRecommendTimetagsByType = function(key,callback){
	var query="";
	if(Util.trim(key)==''){
		query={};
	}
	else{
		var name=eval("/"+key+"/");
		query={'city.cityname':name}
	}
	RecommendTime.find(query, [], {sort: [['title',  'desc']]}, function (err, recommendTimes) {
		if(err)
			callback(err);
		else{
			if(recommendTimes.length>0){
				callback(null,recommendTimes[0].time_interval);
			}else{
				callback(null,null);
			}

		}
	});
};
exports.getRecommendTimesByQuery = function(query,callback){
	RecommendTime.find(query, [], {sort: [['title',  'desc']]}, function (err, recommendTimes) {
		if(err)
			callback(err);
		else{
			callback(null,recommendTimes);
		}
	});
};

exports.count = function (type, callback) {
	RecommendTime.count({}, callback);
};

exports.updateImage=function(_id,image,callback){
	exports.getRecommendTime(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.title+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			result.cover_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.update = function(one,callback){

	exports.getRecommendTime(new ObjectID(one._id+''),function(err,result){
		if(result){
			result.city = one.city;
			result.time_interval = one.time_interval;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.newAndSave = function(city,time_interval,callback){
	var recommendTime = new RecommendTime();
	recommendTime.city = city;
	recommendTime.time_interval = time_interval;


	recommendTime.save(function (err) {
			callback(err, recommendTime);
	});
};
