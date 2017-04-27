var models = require('../models');
var News = models.News;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
exports.getNews_cms = function (id, callback) {
  News.findOne({_id: id}, callback);
};

exports.getNews_cmsByEnName = function (title, callback) {
	News.findOne({title: title}, callback);
};

exports.getNews_cmssByTypeLimit = function (type,skip,pageLimit, callback) {
	News.find({type:type}, [], {sort: [['title',  'desc']],skip:skip, limit:pageLimit}, function (err, news_cmss) {
		if(err)
			callback(err);
		else{
			callback(null,news_cmss);
		}
	});
};
exports.getnews_cmsByQuery = function(query,callback){
	News.find(query, function (err, news_cmss) {
		if(err)
			callback(err);
		else{
			callback(null,news_cmss);
		}
	});
};
exports.getNews_cmssByType = function(type,callback){
	News.find({type: type}, [], {sort: [['title', 'desc']]}, function (err, news_cmss) {
		if(err)
			callback(err);
		else{
			callback(null,news_cmss);
		}
	});
};
exports.getNews_cmstagsByType = function(type,key,callback){
	var query="";
	if(Util.trim(key)==''){
		query={type: type};
	}
	else{
		var name=eval("/"+key+"/");
		query={type: type,title:name}
	}
	News.find(query, [], {sort: [['title',  'desc']]}, function (err, news_cmss) {
		if(err)
			callback(err);
		else{
			callback(null,news_cmss);
		}
	});
};
exports.getNews_cmssByQuery = function(query,callback){
	News.find(query, [], {sort: [['title',  'desc']]}, function (err, news_cmss) {
		if(err)
			callback(err);
		else{
			callback(null,news_cmss);
		}
	});
};

exports.count = function (type, callback) {
	News.count({type:type}, callback);
};
exports.count_query = function (query, callback) {
	News.count(query, callback);
};

exports.updateImage=function(_id,image,callback){
	exports.getNews_cms(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.title+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			result.image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.update = function(one,callback){

	exports.getNews_cms(new ObjectID(one._id+''),function(err,result){
		if(result){
			result.lead = one.lead;
			result.image = one.image;
			result.lead_text = one.lead_text;
			result.type = one.type;
			result.last_modify_time = one.last_modify_time;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.newAndSave = function(type,last_modify_time,lead,lead_text,callback){
	var news_cms = new News();
	news_cms.type = type;
	news_cms.last_modify_time = last_modify_time;
	news_cms.lead = lead;
	news_cms.image = '';
	news_cms.lead_text = lead_text;
	//news_cms.en_name = en_name;

	news_cms.save(function (err) {
			callback(err, news_cms);
	});
};
