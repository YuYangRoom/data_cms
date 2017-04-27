var models = require('../models');
var RecommendRule = models.RecommendRule;;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
var Restaurant = require('../models').Restaurant;
var Attraction = require('../models').Attraction;
var Shopping = require('../models').Shopping;
var Area = require('../models').Area;
var Activity = require('../models').Activity;
var Pgc = require('../models').Pgc;
var News = require('../models').News;
var async = require('async');
exports.getRecommendRule = function (id, callback) {
	RecommendRule.findOne({_id: id}, callback);
};

exports.getRecommendRuleByEnName = function (title, callback) {
	RecommendRule.findOne({title: title}, callback);
};

exports.getRecommendRulesByTypeLimit = function (type,skip,pageLimit, callback) {
	RecommendRule.find({}, [], {sort: [['title',  'desc']],skip:skip, limit:pageLimit}, function (err, recommendRules) {
		if(err)
			callback(err);
		else{
			callback(null,recommendRules);
		}
	});
};
exports.getrecommendRuleByQuery = function(query,callback){
	RecommendRule.find(query, [], {sort: [['title', 'desc']],limit:10}, function (err, recommendRules) {
		if(err)
			callback(err);
		else{
			callback(null,recommendRules);
		}
	});
};
exports.getRecommendRulesByType = function(type,callback){
	RecommendRule.find({type: type}, [], {sort: [['title', 'desc']]}, function (err, recommendRules) {
		if(err)
			callback(err);
		else{
			callback(null,recommendRules);
		}
	});
};
exports.getRecommendRuletagsByType = function(type,key,callback){
	var query="";
	if(Util.trim(key)==''){
		query={type: type};
	}
	else{
		var name=eval("/"+key+"/");
		query={type: type,title:name}
	}
	RecommendRule.find(query, [], {sort: [['title',  'desc']]}, function (err, recommendRules) {
		if(err)
			callback(err);
		else{
			callback(null,recommendRules);
		}
	});
};
exports.getRecommendRulesByQuery = function(query,callback){
	RecommendRule.find(query, [], {sort: [['title',  'desc']]}, function (err, recommendRules) {
		if(err)
			callback(err);
		else{
			callback(null,recommendRules);
		}
	});
};

exports.count = function (type, callback) {
	RecommendRule.count({}, callback);
};
exports.updateImage=function(_id,image,callback){
	exports.getRecommendRule(new ObjectID(_id+''),function(err,result){
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
	exports.getRecommendRule(new ObjectID(one._id+''),function(err,result){
		if(result){
			var p_poi = one.recom_content;
			async.map(p_poi, function (item, callback) {
					var query1 = item.id;
					var type = item.type;
					switch (type) {
						case '0':
							Attraction.findOne({_id: query1}, function (err, data) {
								if (data) {
									if (data.coverImageName) {
										item.coverImage = data.coverImageName;
									} else {
										item.coverImage = '';
									}
									if (data.attractions) {
										item.title = data.attractions;
									} else {
										item.title = '';
									}
									if (data.short_introduce) {
										item.short_introduce = data.short_introduce;
									} else {
										item.short_introduce = '';
									}
									callback(null, item);
								} else {
									console.log('查询失败！');
									callback(null, null);
								}
							});
							break;
						case '1':
							Restaurant.findOne({_id: query1}, function (err, data) {
								if (data) {
									if (data.cover_image) {
										item.coverImage = data.cover_image;
									} else {
										item.coverImage = '';
									}

									if (data.name) {
										item.title = data.name;
									} else {
										item.title = '';
									}

									if (data.brief_introduce) {
										item.short_introduce = data.brief_introduce;
									} else {
										item.short_introduce = '';
									}
									callback(null, item);
								} else {
									console.log('查询失败！');
									callback(null, null);
								}
							});
							break;
						case '2':
							Shopping.findOne({_id: query1}, function (err, data) {
								if (data) {
									if (data.cover_image) {
										item.coverImage = data.cover_image;
									} else {
										item.coverImage = '';
									}

									if (data.name) {
										item.title = data.name;
									} else {
										item.title = '';
									}

									if (data.brief_introduce) {
										item.short_introduce = data.brief_introduce;
									} else {
										item.short_introduce = '';
									}
									callback(null, item);
								} else {
									console.log('查询失败！');
									callback(null, null);
								}
							});
							break;
						case '3':
							Area.findOne({_id: query1}, function (err, data) {
								if (data) {
									if (data.cover_image) {
										item.coverImage = data.cover_image;
									} else {
										item.coverImage = '';
									}
									if (data.area_name) {
										item.title = data.area_name;
									} else {
										item.title = '';
									}
									if (data.area_introduce) {
										item.short_introduce = data.area_introduce;
									} else {
										item.short_introduce = '';
									}
									callback(null, item);
								} else {
									console.log('查询失败！');
									callback(null, null);
								}
							});
							break;
						case '4':
							Activity.findOne({_id: query1}, function (err, data) {
								if (data) {
									if (data.cover_image) {
										item.coverImage = data.cover_image;
									} else {
										item.coverImage = '';
									}
									if (data.title) {
										item.title = data.title;
									} else {
										item.title = '';
									}
									if (data.open_time) {
										item.open_time = data.open_time;
									} else {
										item.open_time = '';
									}
									if (data.close_time) {
										item.close_time = data.close_time;
									} else {
										item.close_time = '';
									}
									callback(null, item);
								} else {
									console.log('查询失败！');
									callback(null, null);
								}
							});
							break;
						case '5':
							Pgc.findOne({_id: query1}, function (err, data) {
								if (data) {
									if (data.cover_image) {
										item.coverImage = data.cover_image;
									} else {
										item.coverImage = '';
									}
									if (data.title) {
										item.title = data.title;
									} else {
										item.title = '';
									}
									if (data.introducation) {
										item.introducation = data.introducation;
									} else {
										item.introducation = '';
									}
									callback(null, item);
								} else {
									console.log('查询失败！');
									callback(null, null);
								}
							});
							break;
						case '6':
							News.findOne({_id: query1}, function (err, data) {
								if (data) {
									if (data.image) {
										item.coverImage = data.image;
									} else {
										item.coverImage = '';
									}

									if (data.lead) {
										item.title = data.lead;
									} else {
										item.title = '';
									}

									if (data.news_content[0]) {
										item.text =data.news_content[0].text;
									} else {
										item.text = '';
									}

									callback(null, item);
								} else {
									console.log('查询失败！');
									callback(null, null);
								}
							});
							break;
						default :
							console.log('poi与类型匹配失败！');
							callback(null, null);
							break;
					}
				}, function (err, res2) {
					var p_poi_2 = [];
					for (var i = 0; i < res2.length; i++) {
						if (res2[i]) {
							p_poi_2.push(res2[i]);
						}

					}
					result.one = one.one;
					result.two = one.two;
					result.three = one.three;
					result.four = one.four;
					result.five = one.five;
					result.six = one.six;
					result.seven = one.seven;
					result.eight = one.eight;
					result.isValid = one.isValid;
					result.city = one.city;
					result.type = one.type;
					result.title = one.title;
					result.desc = one.desc;
					result.longitude = one.longitude;
					result.latitude = one.latitude;
					result.range = one.range;
					result.recom_content = p_poi_2;
					result.startDate = one.startDate;
					result.endDate = one.endDate;
					result.week = one.week;
					result.time_rules = one.time_rules;
					result.save(function (err) {
						callback(err, result);
					});
				}
			);
		}else{
			callback(err+'not found!')
		}
	});
};

exports.newAndSave = function(one,two,three,four,five,six,seven,eight,isValid,city,type,title,desc,longitude,latitude,range,recom_content,startDate,endDate,week,time_rules,callback){
	var recommendRule = new RecommendRule();
	var p_poi =recom_content;
	async.map(p_poi, function (item, callback) {
			var query1 = item.id;
			var type = item.type;
			switch (type) {
				case '0':
					Attraction.findOne({_id: query1}, function (err, data) {
						if (data) {
							if (data.coverImageName) {
								item.coverImage = data.coverImageName;
							} else {
								item.coverImage = '';
							}
							if (data.attractions) {
								item.title = data.attractions;
							} else {
								item.title = '';
							}
							if (data.short_introduce) {
								item.short_introduce = data.short_introduce;
							} else {
								item.short_introduce = '';
							}
							callback(null, item);
						} else {
							console.log('查询失败！');
							callback(null, null);
						}
					});
					break;
				case '1':
					Restaurant.findOne({_id: query1}, function (err, data) {
						if (data) {
							if (data.cover_image) {
								item.coverImage = data.cover_image;
							} else {
								item.coverImage = '';
							}

							if (data.name) {
								item.title = data.name;
							} else {
								item.title = '';
							}

							if (data.brief_introduce) {
								item.short_introduce = data.brief_introduce;
							} else {
								item.short_introduce = '';
							}
							callback(null, item);
						} else {
							console.log('查询失败！');
							callback(null, null);
						}
					});
					break;
				case '2':
					Shopping.findOne({_id: query1}, function (err, data) {
						if (data) {
							if (data.cover_image) {
								item.coverImage = data.cover_image;
							} else {
								item.coverImage = '';
							}

							if (data.name) {
								item.title = data.name;
							} else {
								item.title = '';
							}

							if (data.brief_introduce) {
								item.short_introduce = data.brief_introduce;
							} else {
								item.short_introduce = '';
							}
							callback(null, item);
						} else {
							console.log('查询失败！');
							callback(null, null);
						}
					});
					break;
				case '3':
					Area.findOne({_id: query1}, function (err, data) {
						if (data) {
							if (data.cover_image) {
								item.coverImage = data.cover_image;
							} else {
								item.coverImage = '';
							}
							if (data.area_name) {
								item.title = data.area_name;
							} else {
								item.title = '';
							}
							if (data.area_introduce) {
								item.short_introduce = data.area_introduce;
							} else {
								item.short_introduce = '';
							}
							callback(null, item);
						} else {
							console.log('查询失败！');
							callback(null, null);
						}
					});
					break;
				case '4':
					Activity.findOne({_id: query1}, function (err, data) {
						if (data) {
							if (data.cover_image) {
								item.coverImage = data.cover_image;
							} else {
								item.coverImage = '';
							}
							if (data.title) {
								item.title = data.title;
							} else {
								item.title = '';
							}
							if (data.open_time) {
								item.open_time = data.open_time;
							} else {
								item.open_time = '';
							}
							if (data.close_time) {
								item.close_time = data.close_time;
							} else {
								item.close_time = '';
							}
							callback(null, item);
						} else {
							console.log('查询失败！');
							callback(null, null);
						}
					});
					break;
				case '5':
					Pgc.findOne({_id: query1}, function (err, data) {
						if (data) {
							if (data.cover_image) {
								item.coverImage = data.cover_image;
							} else {
								item.coverImage = '';
							}
							if (data.title) {
								item.title = data.title;
							} else {
								item.title = '';
							}
							if (data.introducation) {
								item.introducation = data.introducation;
							} else {
								item.introducation = '';
							}
							callback(null, item);
						} else {
							console.log('查询失败！');
							callback(null, null);
						}
					});
					break;
				case '6':
					News.findOne({_id: query1}, function (err, data) {
						if (data) {
							if (data.image) {
								item.coverImage = data.image;
							} else {
								item.coverImage = '';
							}

							if (data.lead) {
								item.title = data.lead;
							} else {
								item.title = '';
							}

							if (data.news_content[0]) {
								item.text =data.news_content[0].text;
							} else {
								item.text = '';
							}

							callback(null, item);
						} else {
							console.log('查询失败！');
							callback(null, null);
						}
					});
					break;
				default :
					console.log('poi与类型匹配失败！');
					callback(null, null);
					break;
			}
		}, function (err, res2) {
			var p_poi_2 = [];
			for (var i = 0; i < res2.length; i++) {
				if (res2[i]) {
					p_poi_2.push(res2[i]);
				}

			}
		recommendRule.one = one;
		recommendRule.two = two;
		recommendRule.three = three;
		recommendRule.four = four;
		recommendRule.five = five;
		recommendRule.six = six;
		recommendRule.seven = seven;
		recommendRule.eight = eight;
		recommendRule.isValid = isValid;
		recommendRule.city = city;
		recommendRule.type = type;
		recommendRule.title = title;
		recommendRule.desc = desc;
		recommendRule.longitude = longitude;
		recommendRule.latitude = latitude;
		recommendRule.range = range;
		recommendRule.recom_content = p_poi_2;
		recommendRule.startDate = startDate;
		recommendRule.endDate = endDate;
		recommendRule.week = week;
		recommendRule.time_rules = time_rules;
		recommendRule.save(function (err) {
			callback(err, recommendRule);
		});
		}
	);










};
