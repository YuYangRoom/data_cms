var models = require('../models');
var Task = models.Task;
var ObjectID = require('mongodb').ObjectID;
var Auditing = require('./auditing');
// var EventProxy = require('eventproxy');

exports.getTask = function (id, callback) {
  Task.findOne({_id: id}, callback);
};

exports.getTasksByLimit = function (skip,pageLimit,query, callback) {
  Task.find(query, [], {sort: [['status','asc'],['create_at', 'desc']],skip:skip, limit:pageLimit}, function (err, tasks) {
		if(err)
			callback(err);
		else{
			callback(null,tasks);
		}
	});
};

exports.getTasksByQuery = function (query, callback) {
  Task.find(query, [], {sort: [['status','asc'],['create_at', 'desc']]}, function (err, tasks) {
		if(err)
			callback(err);
		else{
			callback(null,tasks);
		}
	});
};

exports.count = function (query,callback) {
  Task.count(query, callback);
};

exports.updateFinishRate = function(taskId,callback){
	Auditing.count({task_id:taskId,status:50},function(err,count){
		exports.getTask(taskId,function(err1,task){
			if(task){
				task.finish_rate = parseInt((count/task.total)*100);
				task.save(function(err2){
					callback(err2,task);
				});
			}else{
				callback(err1+' or not found!');
			}
		});
	});
};

exports.update = function(one,callback){
	exports.getTask(new ObjectID(one._id+''),function(err,task){
		if(task){
			task.city_id = one.city_id;
			task.city_name = one.city_name;
			task.name = one.name;
			task.editor_id = one.editor_id;
			task.editor_name = one.editor_name;
			task.days = one.days;
			task.attraction_num = one.attraction_num;
			task.restaurant_num = one.restaurant_num;
			task.shopping_num = one.shopping_num;
			task.entertainment_num = one.entertainment_num;
			task.total = one.total;
			task.desc = one.desc;
			task.save(function(err){
				callback(err,task);
			});
		}else{
			callback(err+'not found!');
		}
	});
};

exports.newAndSave = function(one,callback){
	var task = new Task();
	task.city_id = one.city_id;
	task.city_name = one.city_name;
	task.name = one.name;
	task.editor_id = one.editor_id;
	task.editor_name = one.editor_name;
	task.days = one.days;
	task.attraction_num = one.attraction_num;
	task.restaurant_num = one.restaurant_num;
	task.shopping_num = one.shopping_num;
	task.entertainment_num = one.entertainment_num;
	task.total = one.total;
	task.desc = one.desc;
	task.save(function (err) {
		callback(err, task);
	});
};
