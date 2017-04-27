var models = require('../models');
var Lifetag = models.Lifetag;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getLifetag = function (id, callback) {
  Lifetag.findOne({_id: id}, callback);
};

exports.getLifetagsByTypeLimit = function (type,skip,pageLimit, callback) {
  Lifetag.find({type: type}, [], {sort: [['name', 'desc']],skip:skip, limit:pageLimit}, function (err, lifetags) {
		if(err)
			callback(err);
		else{
			callback(null,lifetags);
		}
	});
};

exports.getLifetagsByType = function(type,callback){
	Lifetag.find({type: type}, [], {sort: [['name', 'desc']]}, function (err, lifetags) {
		if(err)
			callback(err);
		else{
			callback(null,lifetags);
		}
	});
};

exports.count = function (type, callback) {
  Lifetag.count({type: type}, callback);
};

exports.update = function(one,callback){
	exports.getLifetag(new ObjectID(one._id+''),function(err,result){
		if(result){
			result.type = one.type;
			result.name = one.name;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};

exports.newAndSave = function(type,name,callback){
	var lifetag = new Lifetag();
	lifetag.type = type;
	lifetag.name = name;
	lifetag.save(function (err) {
		callback(err, lifetag);
	});
};
