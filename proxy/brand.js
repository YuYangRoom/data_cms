var models = require('../models');
var Brand = models.Brand;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
exports.getBrand = function (id, callback) {
  Brand.findOne({_id: id}, callback);
};

exports.getBrandByEnName = function (title, callback) {
  Brand.findOne({title: title}, callback);
};

exports.getBrandsByTypeLimit = function (type,skip,pageLimit, callback) {
  Brand.find({type: type}, [], {sort: [['title',  'desc']],skip:skip, limit:pageLimit}, function (err, brands) {
		if(err)
			callback(err);
		else{
			callback(null,brands);
		}
	});
};
exports.getbrandByQuery = function(query,callback){
	Brand.find(query, [], {sort: [['title', 'desc']],limit:10}, function (err, brands) {
		if(err)
			callback(err);
		else{
			callback(null,brands);
		}
	});
};
exports.getBrandsByType = function(type,callback){
	Brand.find({type: type}, [], {sort: [['title', 'desc']]}, function (err, brands) {
		if(err)
			callback(err);
		else{
			callback(null,brands);
		}
	});
};
exports.getBrandtagsByType = function(type,key,callback){
	var query="";
	if(Util.trim(key)==''){
		query={type: type};
	}
	else{
		var name=eval("/"+key+"/");
		query={type: type,title:name}
	}
	Brand.find(query, [], {sort: [['title',  'desc']]}, function (err, brands) {
		if(err)
			callback(err);
		else{
			callback(null,brands);
		}
	});
};
exports.getBrandsByQuery = function(query,callback){
	Brand.find(query, [], {sort: [['title',  'desc']]}, function (err, brands) {
		if(err)
			callback(err);
		else{
			callback(null,brands);
		}
	});
};

exports.count = function (type, callback) {
  Brand.count({type: type}, callback);
};

exports.updateImage=function(_id,image,callback){
	exports.getBrand(new ObjectID(_id+''),function(err,result){
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

	exports.getBrand(new ObjectID(one._id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.title+'#####'+one.desc);
			result.type = one.type;
			result.title = one.title;
			result.advice = one.advice;
			result.desc = one.desc;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.newAndSave = function(type,title,advice,desc,callback){
	var brand = new Brand();
	brand.type = type;
	brand.title = title;
	brand.advice = advice;
	brand.desc = desc;
	//brand.en_name = en_name;

	brand.save(function (err) {
			callback(err, brand);
	});
};
