var models = require('../models');
var Bigtype = models.Bigtype;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getBigtype = function (id, callback) {
  Bigtype.findOne({_id: id}, callback);
};

exports.getBigtypesByType = function(type,callback){
	Bigtype.find({type: type}, [], {sort: [['name', 'desc']]}, function (err, bigtypes) {
		if(err)
			callback(err);
		else{
			callback(null,bigtypes);
		}
	});
};

exports.getBigtypesByQuery = function(query,callback){
	Bigtype.find(query, [], {sort: [['name', 'desc']]}, function (err, bigtypes) {
		if(err)
			callback(err);
		else{
			callback(null,bigtypes);
		}
	});
};

exports.count = function (type, callback) {
  Bigtype.count({type: type}, callback);
};

exports.update = function(one,callback){
	exports.getBigtype(new ObjectID(one._id+''),function(err,result){
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
	var bigtype = new Bigtype();
	bigtype.type = type;
	bigtype.name = name;
	bigtype.save(function (err) {
		callback(err, bigtype);
	});
};
