var models = require('../models');
var Taskquestion = models.Taskquestion;
var ObjectID = require('mongodb').ObjectID;
// var EventProxy = require('eventproxy');

exports.getTaskquestion = function (id, callback) {
  Taskquestion.findOne({_id: id}, callback);
};

exports.getTaskquestionsByLimit = function (skip,pageLimit,query, callback) {
  Taskquestion.find(query, [], {sort: [['is_closed','asc'],['create_at', 'desc']],skip:skip, limit:pageLimit}, function (err, taskquestions) {
		if(err)
			callback(err);
		else{
			callback(null,taskquestions);
		}
	});
};

exports.getTaskquestionsByQuery = function (query, callback) {
  Taskquestion.find(query, [], {sort: [['is_closed','asc'],['create_at', 'desc']]}, function (err, taskquestions) {
		if(err)
			callback(err);
		else{
			callback(null,taskquestions);
		}
	});
};

exports.count = function (query,callback) {
  Taskquestion.count(query, callback);
};

exports.closeTaskquestion = function(taskquestionId,callback){
	exports.getTaskquestion(taskquestionId,function(err,one){
		if(one){
			one.is_closed = true;
			one.save(function(err){
				callback(err,one);
			});
		}else{
			callback(err,one);
		}
	});
};

exports.update = function(one,callback){
	exports.getTaskquestion(new ObjectID(one._id+''),function(err,taskquestion){
		if(taskquestion){
			taskquestion.asker_id = one.asker_id;
			taskquestion.asker_name = one.asker_name;
			taskquestion.answer_id = one.answer_id;
			taskquestion.content = one.content;
			taskquestion.is_closed = one.is_closed;
			taskquestion.save(function(err){
				callback(err,taskquestion);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.newAndSave = function(one,callback){
	var taskquestion = new Taskquestion();
	taskquestion.asker_id = one.asker_id;
	taskquestion.asker_name = one.asker_name;
	taskquestion.answer_id = one.answer_id;
	taskquestion.answer_name = one.answer_name;
	taskquestion.content = one.content;
	taskquestion.save(function (err) {
		callback(err, taskquestion);
	});
};
