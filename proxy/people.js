var models = require('../models');
var People = models.People;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
exports.getPeople = function (id, callback) {
	People.findOne({_id: id}, callback);
};

exports.getPeopleByEnName = function (username, callback) {
	People.findOne({username: username}, callback);
};

exports.getPeoplesByTypeLimit = function (type,skip,pageLimit, callback) {
	People.find({type: type}, [], {sort: [['username',  'desc']],skip:skip, limit:pageLimit}, function (err, peoples) {
		if(err)
			callback(err);
		else{
			callback(null,peoples);
		}
	});
};

exports.getPeoplesByType = function(type,callback){
	People.find({type: type}, [], {sort: [['username', 'desc']]}, function (err, peoples) {
		if(err)
			callback(err);
		else{
			callback(null,peoples);
		}
	});
};
exports.getPeopletagsByType = function(type,key,callback){
	//console.log(type+'#'+key);
	var query="";
	if(Util.trim(key)==''){
		query={type: type};
	}
	else{
		var name=eval("/"+key+"/");
		query={type: type,username:name}
	}
	People.find(query, function (err, peoples) {
		if(err)
			callback(err);
		else{
			callback(null,peoples);
		}
	});
};
exports.getPeoplesByQuery = function(query,callback){
	People.find(query, [], {sort: [['username',  'desc']]}, function (err, peoples) {
		if(err)
			callback(err);
		else{
			callback(null,peoples);
		}
	});
};

exports.count = function (type, callback) {
	People.count({type: type}, callback);
};

exports.updateImage=function(_id,image,callback){
	exports.getPeople(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.username+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			result.cover_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.updateHead_Image=function(_id,image,callback){
	exports.getPeople(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.username+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			result.head_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.updateImage2=function(_id,image,callback){
	exports.getPeople(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.username+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			result.head_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.update = function(one,callback){

	exports.getPeople(new ObjectID(one._id+''),function(err,result){
		if(result){
	/*		var s_introduce=one.simple_introduce;
			var s_image= one.image_content;
			for(var i=0;i<s_introduce.length;i++){
				for(var j=0;j<s_image.length;j++){
					if(s_introduce[i].image_order==s_image[j].order){
						s_introduce[i].image=s_image[j].imageId;
					}
				}
			}*/
			result.type = one.type;
			result.username = one.username;
			result.city_name = one.city_name;
			//result.simple_introduce =s_introduce;
			result.job_desc = one.job_desc;
			result.short_introduce = one.short_introduce;

			//console.log( one.image_content[0].imageId+'*****');
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.newAndSave = function(type, username,city_name,short_introduce,job_desc,callback){

	var people = new People();
	people.type = type;
	people.username = username;
	people.city_name = city_name;
	//people.simple_introduce = simple_introduce;
	people.short_introduce = short_introduce;
	people.job_desc = job_desc;
	people.save(function (err) {
			callback(err, people);
	});
};
