var models = require('../models');
var Attraction = models.Attraction;
var ObjectID = require('mongodb').ObjectID;

exports.findAttractions = function(query,callback) {
	Attraction.find(query, callback);
}

exports.findOneByName = function(query, callback) {
	Attraction.findOne(query, callback);
}

exports.update = function(one, callback) {
	console.log('@@@@@@@@@@@@@@@@');
	var name = one.attractions;
	Attraction.findOne({attractions: name},function(err, result){
		if(err) console.log(err);
		if(result){
			result.cityname				= one.cityname;
			result.activity             = one.activity;
			result.attractions_en 		= one.attractions_en;
			result.comments_url 		= one.comments_url;
			result.address 				= one.address;
			result.price 				= one.price;
			result.opentime 			= one.opentime;
			result.dayornight 			= one.dayornight;
			result.website 				= one.website;
			result.telno 				= one.telno;
			result.attractions 			= one.attractions;
			result.introduce 			= one.introduce;
			result.tips 				= one.tips;
			result.short_introduce		= one.short_introduce;
			result.recommand_flag		= one.recommand_flag;
			result.recommand_duration	= one.recommand_duration;
			result.recommand_reason	= one.recommand_reason;
			result.traffic_info			= one.traffic_info;
			result.show_flag			= one.show_flag;
			result.index_flag			= one.index_flag;
			result.masterLabel			= one.masterLabel;
			result.subLabel				= one.subLabel;
			result.comment_top		    = one.comment_top;
			result.activities		    = one.activities;
			result.latitude				= one.latitude;
			result.longitude			= one.longitude;
			result.am 					= one.am;
			result.pm 					= one.pm;
			result.ev 					= one.ev;
			result.createFlag 			= '0';
			result.save(function(err){
				callback(err);
			});
		}
	})
}

exports.updatemsg = function(one, callback){
	var _id = one._id;
	Attraction.update({_id: new ObjectID(_id)},{$set:{
		cityname				: one.cityname,
		activity                :one.activity,
		attractions_en 		: one.attractions_en,
		address 				: one.address,
		price 				: one.price,
		opentime 			: one.opentime,
		dayornight 			: one.dayornight,
		website 				: one.website,
		telno 				: one.telno,
		attractions 			: one.attractions,
		introduce 			: one.introduce,
		tips 				: one.tips,
		short_introduce		: one.short_introduce,
		recommand_flag		: one.recommand_flag,
		recommand_duration	: one.recommand_duration,
		recommand_reason	: one.recommand_reason,
		traffic_info			: one.traffic_info,
		show_flag			: one.show_flag,
		index_flag			: one.index_flag,
		// masterLabel			: one.masterLabel,
		// subLabel				: one.subLabel,
		comments_top        : one.comments_top,
		activities        : one.activities,
		comments_url        : one.comments_url,
		latitude			: one.latitude,
		longitude			: one.longitude,
		am 					: one.am,
		pm 					: one.pm,
		ev 					: one.ev,
		createFlag 			: '0',
		en_info : {
			opentime		: one.en_info.opentime,
			traffic_info	: one.en_info.traffic_info,
			short_introduce : one.en_info.short_introduce,
			introduce 		: one.en_info.introduce,
			tips 			: one.en_info.tips
		}
	}},callback)
}

exports.updateAudit = function(one, callback){
	Attraction.update({attractions: one.name},{$set:{
		status : one.status,
		editorname : one.editorname,
		editdate : one.editdate,
		auditorname : one.auditorname,
		auditdate : one.auditdate
	}},function(err, result){
		console.log(err);
	})
}