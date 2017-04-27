var models = require('../models');
var RecommendInfo = models.RecommendInfo;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
var Restaurant = require('../models').Restaurant;
var Attraction = require('../models').Attraction;
var Shopping = require('../models').Shopping;
var Area = require('../models').Area;
var Activity = require('../models').Activity;
var Pgc = require('../models').Pgc;
var News = require('../models').News;

exports.getRecommendInfo = function (id, callback) {
  RecommendInfo.findOne({_id: id}, callback);
};

exports.getRecommendInfoByEnName = function (title, callback) {
  RecommendInfo.findOne({title: title}, callback);
};

exports.getRecommendInfosByTypeLimit = function (type,skip,pageLimit, callback) {
  RecommendInfo.find({type: type}, [], {sort: [['title',  'desc']],skip:skip, limit:pageLimit}, function (err, recommendInfos) {
		if(err)
			callback(err);
		else{
			callback(null,recommendInfos);
		}
	});
};
exports.getrecommendInfoByQuery = function(query,callback){
	RecommendInfo.find(query, [], {sort: [['title', 'desc']],limit:10}, function (err, recommendInfos) {
		if(err)
			callback(err);
		else{
			//console.log(recommendInfos);
			callback(null,recommendInfos);
		}
	});
};
exports.getRecommendInfosByType = function(type,callback){
	RecommendInfo.find({type: type}, [], {sort: [['title', 'desc']]}, function (err, RecommendInfos) {
		if(err)
			callback(err);
		else{
			callback(null,recommendInfos);
		}
	});
};
exports.getRecommendInfotagsByType = function(type,key,callback){
	var query="";
	if(Util.trim(key)==''){
		query={type: type};
	}
	else{
		var name=eval("/"+key+"/");
		query={type: type,title:name}
	}
	RecommendInfo.find(query, [], {sort: [['title',  'desc']]}, function (err, recommendInfos) {
		if(err)
			callback(err);
		else{
			callback(null,recommendInfos);
		}
	});
};
exports.getRecommendInfosByQuery = function(query,callback){
	RecommendInfo.find(query, [], {sort: [['title',  'desc']]}, function (err, recommendInfos) {
		if(err)
			callback(err);
		else{
			callback(null,recommendInfos);
		}
	});
};

exports.count = function (type, callback) {
  RecommendInfo.count({type: type}, callback);
};

exports.count_byName = function (query, callback) {
  RecommendInfo.count(query, callback);
};

exports.updateImage=function(_id,image,callback){

	exports.getRecommendInfo(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.title+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			var item=result.recommend_content;
			item.cover_image=image;
			RecommendInfo.update({_id: _id},{$set:{recommend_content: item}}, callback);
		}else{
			callback(err+'not found!')
		}
	});
};
var getModel = function (type) {
	var model;
	switch (type) {
		case '0':
			model = Attraction;
			break;
		case '1':
			model = Restaurant;
			break;
		case '2':
		    model = Shopping;
		    break;
		case '3':
			model = Area;
			break;
		case '4':
			model = Activity;
			break;
		case '5':
			model = Pgc;
			break;
		case '6':
			model = News;
			break;
		default:
			model = null;
	}
	return model;
};
/*
 http://weegotest.b0.upaiyun.com/attractions/origin/55c32b66fb83c1c77300006e.jpeg
 http://weegotest.b0.upaiyun.com/restaurant/origin/5322c08dfa0bd00c1d000002.jpg
 http://weegotest.b0.upaiyun.com/shopping/origin/5327c20da71a2a9415000001.jpg
 http://weegotest.b0.upaiyun.com/shoparea/origin/54067435fcff4c135a000024.jpeg
* */
exports.update = function(one,callback){

	exports.getRecommendInfo(new ObjectID(one._id+''),function(err,result){
		if(result){
			var type = one.type;
			var _id=one.item.recommend_content_id;
			if((type=='0'||type=='1'||type=='2'||type=='3'||type=='4'||type=='5'||type=='6')&& _id!=''){
				var model=	getModel(type);
				if(model!=''&&model!=null){
					model.findOne({_id:_id},function(err,model_res){
						var cover_image='';
						if(model_res){
							var item=one.item;
							switch(type){
								case '0':
									cover_image = model_res.coverImageName;
									break;
								case '1':
									cover_image = model_res.cover_image;
									break;
								case '2':
									cover_image = model_res.cover_image;
									break;
								case '3':
									cover_image = model_res.cover_image;
									break;
								case '4':
									cover_image = model_res.cover_image;
									break;
								case '5':
									cover_image = model_res.cover_image;
									break;
								case '6':
									var news_content=model_res.news_content;
									if(news_content.length>0){
										cover_image=news_content[0].image;
									}
									//cover_image = model_res.image;
									//console.log(model_res.image);
									//console.log(model_res.lead+'********');
									break;
								default:
									break;
							}
							if(cover_image!=''){
								item.cover_image=cover_image;
							}
							result.type = type;
							result.city_id = one.city_id;
							result.city_name = one.city_name;
							result.recommend_start_date = one.recommend_start_date;
							result.recommend_end_date = one.recommend_end_date;
							result.recommend_poi_position = one.recommend_poi_position;
							result.recommend_radius = one.recommend_radius;
							result.recommend_content =item;
							result.recommend_start_date_1 = one.recommend_start_date_1;
							result.recommend_end_date_1 = one.recommend_end_date_1;
							result.recommend_start_time = one.recommend_start_time;
							result.recommend_end_time = one.recommend_end_time;
							result.recommend_poi_lat = one.recommend_poi_lat;
							result.recommend_poi_lon = one.recommend_poi_lon;
							result.save(function(err){
								callback(err,result);
							});
						}else{
							result.type = type;
							result.city_id = one.city_id;
							result.city_name = one.city_name;
							result.recommend_start_date = one.recommend_start_date;
							result.recommend_end_date = one.recommend_end_date;
							result.recommend_poi_position = one.recommend_poi_position;
							result.recommend_radius = one.recommend_radius;
							result.recommend_content =one.item;
							result.recommend_start_date_1 = one.recommend_start_date_1;
							result.recommend_end_date_1 = one.recommend_end_date_1;
							result.recommend_start_time = one.recommend_start_time;
							result.recommend_end_time = one.recommend_end_time;
							result.recommend_poi_lat = one.recommend_poi_lat;
							result.recommend_poi_lon = one.recommend_poi_lon;
							result.save(function(err){
								callback(err,result);
							});
						}
					});
				}
			}else{
				RecommendInfo.findOne({_id: one._id},function(err,news_rest){
					if(news_rest){
                    var cover_image_back=news_rest.recommend_content.cover_image;
					if(cover_image_back){
						var item=one.item;
						item.cover_image=cover_image_back;
						result.type = type;
						result.city_id = one.city_id;
						result.city_name = one.city_name;
						result.recommend_start_date = one.recommend_start_date;
						result.recommend_end_date = one.recommend_end_date;
						result.recommend_poi_position = one.recommend_poi_position;
						result.recommend_radius = one.recommend_radius;
						result.recommend_content =item;
						result.recommend_start_date_1 = one.recommend_start_date_1;
						result.recommend_end_date_1 = one.recommend_end_date_1;
						result.recommend_start_time = one.recommend_start_time;
						result.recommend_end_time = one.recommend_end_time;
						result.recommend_poi_lat = one.recommend_poi_lat;
						result.recommend_poi_lon = one.recommend_poi_lon;
						result.save(function(err){
							callback(err,result);
						});
					}else{
						result.type = type;
						result.city_id = one.city_id;
						result.city_name = one.city_name;
						result.recommend_start_date = one.recommend_start_date;
						result.recommend_end_date = one.recommend_end_date;
						result.recommend_poi_position = one.recommend_poi_position;
						result.recommend_radius = one.recommend_radius;
						result.recommend_content =one.item;
						result.recommend_start_date_1 = one.recommend_start_date_1;
						result.recommend_end_date_1 = one.recommend_end_date_1;
						result.recommend_start_time = one.recommend_start_time;
						result.recommend_end_time = one.recommend_end_time;
						result.recommend_poi_lat = one.recommend_poi_lat;
						result.recommend_poi_lon = one.recommend_poi_lon;
						result.save(function(err){
							callback(err,result);
						});
					}
					}

				}
				);

			}

		}else{
			callback(err+'not found!')
		}
	});
};
/*
 RecommendInfo.newAndSave(recommendInfo.type, recommendInfo.recommend_start_date,recommendInfo.recommend_end_date, recommendInfo.recommend_poi_position,
 recommendInfo.recommend_radius, recommendInfo.item, function (err, result) {

 recommendInfo.recommend_start_date_1,recommendInfo.recommend_end_date_1, recommendInfo.recommend_start_time, recommendInfo.recommend_end_time,
* */
exports.newAndRecSave = function(type,city_id,city_name,recommend_start_date,recommend_end_date,recommend_poi_position,recommend_radius,item,recommend_start_date_1,
								 recommend_end_date_1,recommend_start_time,recommend_end_time,recommend_poi_lat,recommend_poi_lon,callback){
	var recommendInfo = new RecommendInfo();
/*
	recommendInfo.type = type;
	recommendInfo.city_id = city_id;
	recommendInfo.city_name = city_name;
	recommendInfo.recommend_start_date = recommend_start_date;
	recommendInfo.recommend_end_date = recommend_end_date;
	recommendInfo.recommend_poi_position = recommend_poi_position;
	recommendInfo.recommend_radius = recommend_radius;
	recommendInfo.recommend_content = item;
	recommendInfo.recommend_start_date_1 = recommend_start_date_1;
	recommendInfo.recommend_end_date_1 = recommend_end_date_1;
	recommendInfo.recommend_start_time = recommend_start_time;
	recommendInfo.recommend_end_time = recommend_end_time;
	recommendInfo.recommend_poi_lat = recommend_poi_lat;
	recommendInfo.recommend_poi_lon = recommend_poi_lon;
	recommendInfo.save(function (err) {
			callback(err, recommendInfo);
	});*/
	var _id=item.recommend_content_id;
	if((type=='0'||type=='1'||type=='2'||type=='3'||type=='4'||type=='5')&& _id!=''){
		var model=	getModel(type);
		if(model!=''&&model!=null){
			model.findOne({_id:_id},function(err,model_res){
				var cover_image='';
				if(model_res){
					switch(type){
						case '0':
							cover_image = model_res.coverImageName;
							break;
						case '1':
							cover_image = model_res.cover_image;
							break;
						case '2':
							cover_image = model_res.cover_image;
							break;
						case '3':
							cover_image = model_res.cover_image;
							break;
						case '4':
							cover_image = model_res.cover_image;
							break;
						case '5':
							cover_image = model_res.cover_image;
							break;
						case '6':
							var news_content=model_res.news_content;
							if(news_content.length>0){
								cover_image=news_content[0].image;
							}
							//cover_image = model_res.image;
							//console.log(model_res.image);
							//console.log(model_res.lead+'********');
							break;
						default:
							break;
					}
					if(cover_image!=''){
						item.cover_image=cover_image;
					}
					recommendInfo.type = type;
					recommendInfo.city_id = city_id;
					recommendInfo.city_name = city_name;
					recommendInfo.recommend_start_date = recommend_start_date;
					recommendInfo.recommend_end_date = recommend_end_date;
					recommendInfo.recommend_poi_position = recommend_poi_position;
					recommendInfo.recommend_radius = recommend_radius;
					recommendInfo.recommend_content =item;
					recommendInfo.recommend_start_date_1 = recommend_start_date_1;
					recommendInfo.recommend_end_date_1 = recommend_end_date_1;
					recommendInfo.recommend_start_time = recommend_start_time;
					recommendInfo.recommend_end_time = recommend_end_time;
					recommendInfo.recommend_poi_lat = recommend_poi_lat;
					recommendInfo.recommend_poi_lon = recommend_poi_lon;
					recommendInfo.save(function(err){
						callback(err,recommendInfo);
					});
				}else{
					recommendInfo.type = type;
					recommendInfo.city_id = city_id;
					recommendInfo.city_name = city_name;
					recommendInfo.recommend_start_date = recommend_start_date;
					recommendInfo.recommend_end_date = recommend_end_date;
					recommendInfo.recommend_poi_position = recommend_poi_position;
					recommendInfo.recommend_radius = recommend_radius;
					recommendInfo.recommend_content =item;
					recommendInfo.recommend_start_date_1 = recommend_start_date_1;
					recommendInfo.recommend_end_date_1 = recommend_end_date_1;
					recommendInfo.recommend_start_time = recommend_start_time;
					recommendInfo.recommend_end_time = recommend_end_time;
					recommendInfo.recommend_poi_lat = recommend_poi_lat;
					recommendInfo.recommend_poi_lon = recommend_poi_lon;
					recommendInfo.save(function(err){
						callback(err,recommendInfo);
					});
				}
			});
		}
	}else{
		recommendInfo.type = type;
		recommendInfo.city_id = city_id;
		recommendInfo.city_name = city_name;
		recommendInfo.recommend_start_date = recommend_start_date;
		recommendInfo.recommend_end_date = recommend_end_date;
		recommendInfo.recommend_poi_position = recommend_poi_position;
		recommendInfo.recommend_radius = recommend_radius;
		recommendInfo.recommend_content = item;
		recommendInfo.recommend_start_date_1 = recommend_start_date_1;
		recommendInfo.recommend_end_date_1 = recommend_end_date_1;
		recommendInfo.recommend_start_time = recommend_start_time;
		recommendInfo.recommend_end_time = recommend_end_time;
		recommendInfo.recommend_poi_lat = recommend_poi_lat;
		recommendInfo.recommend_poi_lon = recommend_poi_lon;
		recommendInfo.save(function(err){
			callback(err,recommendInfo);
		});
	}

};
