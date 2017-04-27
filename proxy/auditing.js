var models = require('../models');
var Auditing = models.Auditing;
// var EventProxy = require('eventproxy');

exports.getAuditing = function (id, callback) {
  Auditing.findOne({_id: id}, callback);
};

exports.findAuditingByQuery = function(query,callback){
	Auditing.findOne(query,callback);
};

exports.getAuditingsByLimit = function (skip,pageLimit,query, callback) {
  Auditing.find(query, [], {sort: [['status', 'asc'],['create_at', 'desc']],skip:skip, limit:pageLimit}, function (err, auditings) {
		if(err)
			callback(err);
		else{
			callback(null,auditings);
		}
	});
};

exports.getAuditingsByQuery = function (query, callback) {
  Auditing.find(query, [], {sort: [['status', 'asc'],['create_at', 'desc']]}, function (err, auditings) {
		if(err)
			callback(err);
		else{
			callback(null,auditings);
		}
	});
};

exports.count = function (query,callback) {
  Auditing.count(query, callback);
};

exports.deleteByQuery = function(query,callback){
	Auditing.remove(query,callback);
};

exports.updateStatus = function(_id,status,callback){
	exports.getAuditing(_id,function(err,one){
		if(one){
			one.status = status;
			one.save(function(err){
				callback(err,one);
			});
		}else{
			callback(err+' or not found!');
		}
	});
};
exports.findAuditingByCityname = function (query, callback) {
	Auditing.findOne(query, function (err, auditing) {
		if (err) {
			callback(err);
		}else {
			callback(null, auditing);
		}
	})
}

exports.update = function(one,callback){
	console.log(one);
	Auditing.update({
		item_id: one.item_id
	}, {
		$set: {
			status 			: one.status,
			auditcomment 	: one.auditcomment,
			auditdate 		: one.auditdate,
			en_info			: {
				status 		: one.en_info.status,
				editorname	: one.en_info.editorname,
				auditorname : one.en_info.auditorname
			}
		}
	},callback)
};
//如果是同一个item_id,和同一个editor_id 表明，不需要重新插入，只需要修改数据即可。
exports.newAndSave = function(one,callback){
	var auditing = new Auditing({
		editorname		: one.editorname,
		auditorname 	: one.auditorname,
		countryname 	: one.countryname,
		item_id 		: one.item_id,
		city_name 		: one.city_name,
		name 			: one.name,
		status 			: one.status,
		type 			: one.type,
		editdate 		: one.editdate,
		auditdate 		: one.auditdate,
		auditcomment 	: one.auditcomment,
		en_info 		: {
			status 		: one.en_info.status,
			editorname 	: one.en_info.editorname,
			auditorname : one.en_info.auditorname
		}
	});
	auditing.save(callback);
};
