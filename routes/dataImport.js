var bangkok = require('../data/result_bangkok');
var barcelona = require('../data/result_Barcelona');
var geneva = require('../data/result_geneva');
var kyoto = require('../data/result_kyoto');
var london = require('../data/result_london');
var LosAngeles = require('../data/result_LosAngeles');
var newyork = require('../data/result_newyork');
var osaka = require('../data/result_osaka');
var paris = require('../data/result_paris');
var rome = require('../data/result_rome');
var sanfrancisco = require('../data/result_sanfrancisco');
var seoul = require('../data/result_seoul');
var tokyo = require('../data/result_tokyo');
var venice = require('../data/result_venice');
var zurich = require('../data/result_zurich');
require('../config/Config');
var AttractionsProvider = require("../config/AttractionsProvider").AttractionsProvider;
var attractionsProvider = new AttractionsProvider();
var Attractions = require('./attractions');
var EventProxy = require('eventproxy');

exports.importCity = function(req,res){
	var flag = req.query.flag;
	if(flag){
		var cityItems = getInitData();
		var ep = new EventProxy();
	    ep.bind('error', function (err) {
	        ep.unbind();// 卸载掉所有handler
	        callback(err);// 异常回调
	    });
	    ep.after('getFull', cityItems.length, function (list) {
	        // callback(null,list);
	        res.send(list);
	    });
	    for(var i=0;i<cityItems.length;i++){
	        importOne(cityItems[i],ep.group('getFull'));
	    }

	}else{
		console.log('flag is null');
	}
};

function importOne(cityItem,callback){
	var cityname = cityItem.cityname;
	var items = cityItem.items;
	Attractions.getAttractionsByQuery({cityname:cityname},{},function(err,attractions){
		if(attractions){
			var times = 0;
			console.log(attractions.length);
			var updateData = [];
			for(var i=0;i<attractions.length;i++){
				var attraction = attractions[i];
				for(var k=0;k<items.length;k++){
					if(attraction.attractions_en == trim(items[k].name)){
						console.log('found!'+attraction.attractions_en +'  '+items[k].name);
						
						var setJson = {};
						if(!attraction.address&&items[k].Address){
							setJson.address = items[k].Address;
						}
						if(!attraction.traffic_info&&items[k].traffic){
							setJson.traffic_info = items[k].traffic;
						}
						if(!attraction.website&&items[k].url){
							setJson.website = items[k].url;
						}
						if(!attraction.price&&items[k].Prices){
							setJson.price = items[k].Prices;
						}
						if(!attraction.opentime&&items[k].open_time){
							setJson.opentime = items[k].open_time;
						}
						if(JSON.stringify(setJson)==='{}'){
							console.log('找到，无数据修改！');
						}else{
							var item = {};
							item._id = attraction._id;
							item.name = attraction.attracionts_en;
							item.setJson = setJson;
							updateData.push(item);
							times++;
						}
					}
				}
			}

			var ep = new EventProxy();
		    ep.bind('error', function (err) {
		        ep.unbind();// 卸载掉所有handler
		        callback(err);// 异常回调
		    });
		    ep.after('setJson', updateData.length, function (list) {
		        // callback(null,list);
		        callback(null,times);
		    });
		    for(var i=0;i<updateData.length;i++){
		        insertJson(updateData[i],ep.group('setJson'));
		    }
		}
	});
}

function insertJson(item,callback){
	attractionsProvider.update({'_id': item._id}, {$set:item.setJson}, {safe:true},  function (err, attraction) {
	    if (err) {
	      return callback(err);
	    }
	    if (!attraction) {
	      return callback(new Error('该attractions不存在'));
	    }
	    callback(null,attraction);
  });
}

function getInitData(){
	var cityItems = [];
	cityItems.push({cityname:'曼谷',items:bangkok.items});
	cityItems.push({cityname:'巴塞罗那',items:barcelona.items});
	cityItems.push({cityname:'日内瓦',items:geneva.items});
	cityItems.push({cityname:'京都',items:kyoto.items});
	cityItems.push({cityname:'伦敦',items:london.items});
	cityItems.push({cityname:'洛杉矶',items:LosAngeles.items});
	cityItems.push({cityname:'纽约',items:newyork.items});
	cityItems.push({cityname:'大阪',items:osaka.items});
	cityItems.push({cityname:'巴黎',items:paris.items});
	cityItems.push({cityname:'罗马',items:rome.items});
	cityItems.push({cityname:'旧金山',items:sanfrancisco.items});
	cityItems.push({cityname:'首尔',items:seoul.items});
	cityItems.push({cityname:'东京',items:tokyo.items});
	cityItems.push({cityname:'威尼斯',items:venice.items});
	cityItems.push({cityname:'苏黎世',items:zurich.items});
	return cityItems;
}

function trim(str){  
	if(str)
	    return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');   
	else
		return '';
}
// var name = '  asdf   saefas   ';
// var a = {};
//  console.log(JSON.stringify(a)==='{}');