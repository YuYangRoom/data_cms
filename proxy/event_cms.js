var models = require('../models');
var Event_cms = models.Event_cms;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
exports.getEvent_cms = function (id, callback) {
  Event_cms.findOne({_id: id}, callback);
};

exports.getEvent_cmsByEnName = function (title, callback) {
  Event_cms.findOne({title: title}, callback);
};

exports.getEvent_cmssByTypeLimit = function (type,skip,pageLimit, callback) {
  Event_cms.find({type: type}, [], {sort: [['title',  'desc']],skip:skip, limit:pageLimit}, function (err, event_cmss) {
		if(err)
			callback(err);
		else{
			callback(null,event_cmss);
		}
	});
};
exports.getEvent_cmssByType = function(type,callback){
	Event_cms.find({type: type}, [], {sort: [['title', 'desc']]}, function (err, event_cmss) {
		if(err)
			callback(err);
		else{
			callback(null,event_cmss);
		}
	});
};
exports.getEvent_cmstagsByType = function(type,key,callback){
	var query="";
	if(Util.trim(key)==''){
		query={type: type};
	}
	else{
		var name=eval("/"+key+"/");
		query={type: type,title:name}
	}
	Event_cms.find(query, [], {sort: [['title',  'desc']]}, function (err, event_cmss) {
		if(err)
			callback(err);
		else{
			callback(null,event_cmss);
		}
	});
};
exports.getEvent_cmssByQuery = function(query,callback){
	Event_cms.find(query, [], {sort: [['title',  'desc']]}, function (err, event_cmss) {
		if(err)
			callback(err);
		else{
			callback(null,event_cmss);
		}
	});
};

exports.count = function (type, callback) {
  Event_cms.count({type: type}, callback);
};

exports.updateThumbnail_image=function(_id,image,callback){
	exports.getEvent_cms(new ObjectID(_id+''),function(err,result){
		if(result){
			result.thumbnail_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.updateDetail_Image=function(_id,image,callback){
	exports.getEvent_cms(new ObjectID(_id+''),function(err,result){
		if(result){
			result.detail_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.updateSignupImage=function(_id,image,callback){
	exports.getEvent_cms(new ObjectID(_id+''),function(err,result){
		if(result){
			result.sign_up_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.updatePartner_image=function(_id,image,callback){
	exports.getEvent_cms(new ObjectID(_id+''),function(err,result){
		if(result){
			result.partner_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.update = function(one,callback){

	exports.getEvent_cms(new ObjectID(one._id+''),function(err,result){
		if(result){
			result.city = one.type;
			result.name = one.name;
			result.state = one.state_info;
			result.type = one.type;
			result.desc_type = one.desc;
			result.order = one.order;
			result.time = one.time;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
//event_cms.city, event_cms.name, event_cms.state, event_cms.type,event_cms.desc,event_cms.order,event_cms.time
exports.newAndSave = function(city,name,state_info,type,desc,order,time,callback){
	var event_cms = new Event_cms();
	event_cms.city = city;
	event_cms.name = name;
	event_cms.state = state_info;
	event_cms.type = type;
	event_cms.desc_type = desc;
	event_cms.order = order;
	event_cms.time = time;

	event_cms.save(function (err) {
			callback(err, event_cms);
	});
};
