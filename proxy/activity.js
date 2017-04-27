var models = require('../models');
var Activity = models.Activity;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
exports.getActivity = function (id, callback) {
	Activity.findOne({_id: id}, callback);
};

exports.getActivityByEnName = function (title, callback) {
	Activity.findOne({title: title}, callback);
};

exports.getActivitysByTypeLimit = function (type,skip,pageLimit, callback) {
	Activity.find({type: type}, [], {sort: [['title', 'desc','price','atype','address','open_time','close_time']],skip:skip, limit:pageLimit}, function (err, activitys) {
		if(err)
			callback(err);
		else{
			callback(null,activitys);
		}
	});
};

exports.getActivitysByType = function(type,callback){
	Activity.find({type: type}, [], {sort: [['title', 'desc','price','atype','address','open_time','close_time']]}, function (err, activitys) {
		if(err)
			callback(err);
		else{
			callback(null,activitys);
		}
	});
};

exports.getActivitytagsByType = function (type, key, callback) {
    var query = "";
    if (type != 'all') {
        if (Util.trim(key) == '') {
            query = {type: type};
        }
        else {
            var name = eval("/" + key + "/");
            query = {type: type, title: name}
        }
        Activity.find(query, [], {sort: [['title', 'desc']]}, function (err, activitys) {
            if (err)
                callback(err);
            else {
                callback(null, activitys);
            }
        });
    } else if (type == 'all') {
        if (Util.trim(key) == '') {
            query = {};
        }
        else {
            var name = eval("/" + key + "/");
            query = {title: name}
        }
        Activity.find(query, [], {sort: [['title', 'desc']]}, function (err, activitys) {
            if (err)
                callback(err);
            else {
                callback(null, activitys);
            }
        });
    }

};

exports.getactivityByQuery = function(query,callback){
	Activity.find(query, [], {sort: [['title', 'desc']],limit:10}, function (err, activitys) {
		if(err)
			callback(err);
		else{
			callback(null,activitys);
		}
	});
};

exports.getActivitysByQuery = function(query,callback){
	Activity.find(query, [], {sort: [['title', 'desc','price','atype','address','open_time','close_time']]}, function (err, activitys) {
		if(err)
			callback(err);
		else{
			callback(null,activitys);
		}
	});
};

exports.count = function (type, callback) {
	Activity.count({type: type}, callback);
};
exports.updateImage=function(_id,image,callback){
	exports.getActivity(new ObjectID(_id+''),function(err,result){
		if(result){
			//console.log(one.type+'##'+one.title+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
			result.cover_image=image;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};
exports.update = function(one,callback){
	exports.getActivity(new ObjectID(one._id+''),function(err,result){
		var start_time=one.open_time;
		var open_time=one.open_time;
		open_time=open_time.replace(/日/g, '').replace(/年|月/g, '/');
		start_time=open_time.replace(/\//g, '');
		var end_time=one.close_time;
		var close_time=one.close_time;
		close_time=close_time.replace(/日/g, '').replace(/年|月/g, '/');
	  	    end_time=close_time.replace(/\//g, '');
		if(result){
			//console.log(one.type+'##'+one.title+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
            //console.log('原先的：'+result.latitude+': #### :'+result.longitude);
            //console.log('前端：'+one.latitude+': #### :'+one.longitude);
			if(one.latitude!=''&&one.longitude!=''){
				result.latitude=one.latitude;
				result.longitude=one.longitude;
			}
			result.type = one.type;
			result.acttime = one.acttime;
			result.acturl = one.acturl;
			result.activity_city = one.activity_city;
			result.order_url = one.order_url;
			result.deaddress = one.deaddress;
			result.title = one.title;
			result.address = one.address;
			result.price = one.price;
			result.atype = one.atype;
			result.desc = one.desc;
			result.open_time =open_time;
			result.start_time = start_time;
			result.close_time =close_time;
			result.end_time = end_time;
			result.save(function(err){
				callback(err,result);
			});
		}else{
			callback(err+'not found!')
		}
	});
};

exports.newAndSave = function(type,title,open_time,close_time,desc,price,atype,address,acturl,activity_city,order_url,acttime,deaddress,longitude,latitude,callback){
	/*var start_time=open_time;
	  start_time=start_time.replace(/年|月|日/g, '');
	var end_time=close_time;
	     end_time=end_time.replace(/年|月|日/g, '');*/
	var start_time=open_time;
	//var open_time=open_time;
	open_time=open_time.replace(/日/g, '').replace(/年|月/g, '/');
	start_time=start_time.replace(/年|月|日/g, '');
	var end_time=close_time;
	//var close_time=close_time;
	close_time=close_time.replace(/日/g, '').replace(/年|月/g, '/');
	end_time=end_time.replace(/年|月|日/g, '');
	var activity = new Activity();
    if(longitude!='' && latitude!=''){
        activity.longitude=longitude;
        activity.latitude=latitude;
            //console.log(longitude+' **** '+ latitude);
    }
	activity.type = type;
	activity.title = title;
	activity.desc = desc;
	activity.open_time = open_time;
	activity.start_time = start_time;
	activity.close_time = close_time;
	activity.end_time = end_time;
	activity.address = address;
	activity.acturl = acturl;
	activity.activity_city = activity_city;
	activity.order_url = order_url;
	activity.acttime = acttime;
	activity.deaddress = deaddress;
	activity.price = price;
	activity.atype= atype;
	//activity.en_name = en_name;

	activity.save(function (err) {
			callback(err, activity);
	});
};
