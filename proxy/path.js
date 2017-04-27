var models = require('../models');
var Path = models.Path;
var ObjectID = require('mongodb').ObjectID;
var EventProxy = require('eventproxy');
var Attractions = require('../routes/attractions');
var Restaurant = require('./restaurant');
var Shopping = require('./shopping');
var Entertainment = require('./entertainment');

exports.getPath = function (id, callback) {
  Path.findOne({_id: id}, callback);
};

exports.getFullPath = function (id, callback) {
  Path.findOne({_id: id}, function(err,one){
  	if(one){
  		var ep =  new EventProxy();
	  	ep.all('a','b', function (a, b) {
	  		one.a = a;
	  		one.b = b;
		    return callback(null, one);
		  }).fail(callback);
	  	findSpotByIdAndType(one.a_id,one.a_type,ep.done('a'));
	  	findSpotByIdAndType(one.b_id,one.b_type,ep.done('b'));
  	}else if(err)
  	  callback(err);
  	else
  		callback(null,one);
  });
};

exports.getFullPathOfTwoPoint = function(a_id,b_id,callback){
	Path.findOne({a_id: a_id,b_id:b_id}, function(err,one){
		if(err) callback(err);
		else{
			if(one){
				var ep =  new EventProxy();
			  	ep.all('a','b', function (a, b) {
			  		one.a = a;
			  		one.b = b;
				    return callback(null, one);
				  }).fail(callback);
			  	findSpotByIdAndType(one.a_id,one.a_type,ep.done('a'));
			  	findSpotByIdAndType(one.b_id,one.b_type,ep.done('b'));
			}
			else
				callback(null,one);
		}
	});
};

function findSpotByIdAndType(id,type,callback){
	if(type=='0'){
		Attractions.getAttractionsByQuery({_id:id},{},callback);
	}else if(type=='1'){
		Restaurant.getRestaurant(id,callback);
	}else if(type=='2'){
		Shopping.getShopping(id,callback);
	}else {
		Entertainment.getEntertainment(id,callback);
	}
}

exports.getPathsByQuery = function(query,callback){
	Path.find(query, [], {sort: [['b_id', 'desc']]}, callback);
};

//查找两个点的path
exports.getPathOfTwoPoint = function(a_id,b_id,callback){
	Path.findOne({a_id: a_id,b_id:b_id}, callback);
};

exports.count = function (city_id, callback) {
  Path.count({city_id: city_id}, callback);
};

exports.newAndSave = function(one,callback){
	var path = new Path();
	exports.getPathOfTwoPoint(new ObjectID(one.a_id+''),new ObjectID(one.b_id+''),function(err,find){
		if(find){
			callback(null,find);
		}else{
			path.city_id = new ObjectID(one.city_id+'');
			path.city_name = one.city_name;
			path.a_id = new ObjectID(one.a_id+'');
			path.a_type = one.a_type;
			path.b_id = new ObjectID(one.b_id+'');
			path.b_type = one.b_type;
			path.a_latitude = one.a_latitude;
			path.a_longitude = one.a_longitude;
			path.b_latitude = one.b_latitude;
			path.b_longitude = one.b_longitude;
			//steps
			// path.bus.steps = one.bus.steps;
			// path.driver.steps = one.driver.steps;
			// path.walk.steps = one.walk.steps;
			// console.log("____1_____" + path.bus.steps);
			// console.log("____2_____" + one.bus.steps);
			path.save(function (err) {
				console.log(err);
				callback(err, path);
			});
		}
	});
	
};

exports.getOneWithEmptySteps = function(mode, callback) {
	var options = '{"' + mode + '.steps": []}';
	Path.findOne(options, callback);
};

exports.getOneWithEmptyStepsSync = function(mode, skipcount, limitcount, callback) {
	// var options = '{"' + mode + '.steps": []}';
	// var query = Path.find({'driver.steps' : [], a_type : "0", b_type : "1"});
	// var query = Path.find({'bus.steps' : []});
	var query = Path.find({"bus.steps" : {"html" : "Zero results error"}});

	//query.skip(skipcount);
	query.limit(limitcount);

	query.exec(callback);
	// var attr = mode + '.steps';
	// Path.where(attr).equals('[]');
};

exports.getDistanceDurations = function(callback) {
	var query = Path.find({"bus.distance": null});
	query.limit(20);
	query.exec(callback);
};

exports.getTaxiFare = function (callback) {
	var query = Path.find({"driver.taxifare": null});
	query.limit(20);
	query.exec(callback);
}



