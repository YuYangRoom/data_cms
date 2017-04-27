var Auditing 	= require('../proxy').Auditing;
var City 		= require('../proxy').City;
var Attractions = require('../proxy').Attractions;
var Restaurant  = require('../proxy').Restaurant;
var Area 		= require('../proxy').Area;
var Shopping 	= require('../proxy').Shopping;
var async 		= require('async');

exports.getedithistory = function (req, res) {
	var query = {
		editorname: req.session.user.username,
	};
	// var currentuser = req.session.user.username;
	if(req.query.status){
		query.status = req.query.status	
	}
	// var name = req.session.user.username;
	console.log(query);
	async.auto({
		edittask: function(cb) {
			Auditing.getAuditingsByQuery(query,cb);
		}
	},function(err, result){
		// result.currentuser = currentuser;
		if(err){
			res.send({err:err})
		}else{
			res.send(result);
		}
	})
}

exports.getaudithistory = function (req, res) {
	var query = {
		auditorname: req.session.user.username,
	};
	if(req.query.status){
		query.status = req.query.status	
	}
	console.log(query);
	// var name = req.session.user.username;
	async.auto({
		audittask: function(cb) {
			Auditing.getAuditingsByQuery(query,cb);
		}
	},function(err, result){
		if(err){
			res.send({err:err})
		}else{
			res.send(result);
		}
	})
}
exports.addAuditTask = function (req, res) {
	var model = JSON.parse(req.body.auditmsg);
	var type = req.body.auditmsg.type;
	var city_name = req.body.auditmsg.city_name;
	var name = req.body.auditmsg.name;
	var item_id = model.item_id;
	console.log(typeof item_id,item_id);
	async.auto({
		audits : function (cb) {
			Auditing.findAuditingByQuery({item_id:item_id},cb);
		},
		newandsaveaudit : ['audits',function (cb, result) {
			console.log(result);
			if(result.audits){
				Auditing.newAndSave(model,cb);
			}else{
				Auditing.update(model, cb);
			}
		}],
		cityitemupdate : function (cb) {
			if(type == 'city'){
				City.update(model, cb);
			}
			if(type == 'attractions'){
				Attractions.updateAudit(model, cb);
			}
			if(type == 'restaurants'){
				Restaurant.updateAudit(model, cb);
			}
			if(type == 'shopareas'){
				Area.updateAudit(model, cb);
			}
			if(type == 'shoppings'){
				Shopping.updateAudit(model, cb);
			}
		},

	},function (err, result) {
		if(err) console.log("ccccccc====" + err);
		res.send({status:'success'});
	})
}

exports.updateAuditTask = function (req, res) {
	var model = JSON.parse(req.body.model);
	console.log('===================>')
	async.auto({
		auditingupdata : function (cb) {
			Auditing.update(model, cb);
		},
		cityupdate : function (cb) {
			City.update(model, cb);
		}
	},function (err, result) {
		console.log(err);
	})
}

exports.updatecityitemAuditTask = function (req, res) {
	var model = JSON.parse(req.body.model);
	async.auto({
		auditingupdata : function (cb) {
			Auditing.update(model, cb);
		},
		cityitemupdate : function (cb) {
			if(model.type == 'attractions'){
				Attractions.updateAudit(model, cb);
			}
			if(model.type == 'restaurants'){
				Restaurant.updateAudit(model, cb);
			}
			if(model.type == 'shoparea'){
				Area.updateAudit(model, cb);
			}
			if(model.type == 'shopping'){
				Shopping.updateAudit(model, cb);
			}
		}
	})
}