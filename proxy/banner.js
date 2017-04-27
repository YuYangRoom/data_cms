var models = require('../models');
var Banner = models.Banner;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
exports.getBanner = function (id, callback) {
  Banner.findOne({_id: id}, callback);
};

exports.getBannerByEnName = function (title, callback) {
  Banner.findOne({title: title}, callback);
};

exports.getBannersByTypeLimit = function (type,skip,pageLimit, callback) {
  Banner.find({type: type}, [], {sort: [['title',  'desc']],skip:skip, limit:pageLimit}, function (err, banners) {
		if(err)
			callback(err);
		else{
			callback(null,banners);
		}
	});
};

exports.getBannersByType = function(type,callback){
	Banner.find({type: type}, [], {sort: [['title', 'desc']]}, function (err, banners) {
		if(err)
			callback(err);
		else{
			callback(null,banners);
		}
	});
};
exports.getBannertagsByType = function(type,key,callback){
	var query="";
	if(Util.trim(key)==''){
		query={type: type};
	}
	else{
		var name=eval("/"+key+"/");
		query={type: type,title:name}
	}
	Banner.find(query, [], {sort: [['title',  'desc']]}, function (err, banners) {
		if(err)
			callback(err);
		else{
			callback(null,banners);
		}
	});
};
exports.getBannersByQuery = function(query,callback){
	Banner.find(query, [], {}, function (err, banners) {
		if(err)
			callback(err);
		else{
			callback(null,banners);
		}
	});
};

exports.count = function (type, callback) {
  Banner.count({type: type}, callback);
};

exports.updateImage=function(_id,image_type,image,callback){
	exports.getBanner(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.title+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			if(image_type=='iphone5'){
				result.iphone5_image=image;
			}else if(image_type=='iphone6'){
				result.iphone6_image=image;
			}else if(image_type=='iphone_plus'){
				result.iPhone6plus_image=image;
			}else if(image_type=='android'){
				result.android_image=image;
			}else if(image_type=='iphone5_Save'){
				result.iphone5_image=image;
			}

			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.updateImage_6=function(_id,image,callback){
	exports.getBanner(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.title+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			result.iphone6_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.updateImage_plus=function(_id,image,callback){
	exports.getBanner(new ObjectID(_id+''),function(err,result){
		if(result){
			result.iPhone6plus_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.updateImage_android=function(_id,image,callback){
	exports.getBanner(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.title+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			result.android_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.update = function(one,callback){

	exports.getBanner(new ObjectID(one._id+''),function(err,result){
		if(result){
			result.ios_url = one.ios_url;
			result.android_url = one.android_url;
			result.type = one.type;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.newAndSave = function(ios_url,android_url,type,callback){
	var banner = new Banner();
	banner.ios_url = ios_url;
	banner.android_url = android_url;
	banner.type = type;
	banner.iPhone6plus_image = "";
	banner.save(function (err) {
			callback(err, banner);
	});
};
