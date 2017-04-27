var Attractions = require('./attractions');
var Restaurant = require('../proxy/restaurant');
var Shopping = require('../proxy/shopping');
var EventProxy = require('eventproxy');
var Path = require('../proxy/path');
var ObjectID = require('mongodb').ObjectID;
var PathsModel = require('../models').Path;
var sleep = require('sleep');


var https = require('https');


var barcelona = '516a3519f8a6461636000003';
var geneva = '516a35218902ca1936000003';
var london = '516a35218902ca1936000005';
var losangeles = '516a34f958e3511036000003';
var newyork = '516a34f958e3511036000001';
var paris = '516a350ec221c21236000003';
var roma = '51d3d238e98bbb566a000001';
var sanfrancisco = '516a34f958e3511036000002';
var singapore = '516a3535dac6182136000004';
var zurich = '516a35218902ca1936000002';
var venezia = '516a3519f8a6461636000001';


var googlekeys = [
				'AIzaSyDMRyBL9sn1vA3MbjDtX4W54Si-vXmVI9I',
				'AIzaSyAZLPKceML58HmRhUilEAJk7eVzX-YWvDk',
				'AIzaSyC3C4H0cmeDg_zsdClUmTHZawfX4ud0KJg',
				'AIzaSyBs_-L-SJd6jRs1lDg7or9ML9-f6qSyJPY',
				'AIzaSyD2yN3H6AZo2ZRVV1TKE1Qgjwp_aihXgIg',
				'AIzaSyBE6jCDCiCYiiWte8mHU2eCWRpnesg9wi0',
				'AIzaSyB8k898ceQQQRP8E7d6MGV7uR70SjglIRs',
				'AIzaSyAAqiB8LKdAO2TFce938JhYxRzV5iocYnA',
				'AIzaSyBWdhuY4bvEvpXFUXmd0f-CVPI7bPeDIrI',
				'AIzaSyAyB1quLjB8AQJX7uIFI4CccScGtIQo_Iw',
				'AIzaSyDXZs4uH6GfJvty_d5lxSdAYOIGni4ONpA',
				'AIzaSyD3bSBcHxhXnbGNmOMyZIq0yZQKT5SK5vE',
				'AIzaSyA6VApU2NvCe6_vXP-uUVR3tp7tytXmktk',
				'AIzaSyCxbK33U4sc03RiMYvbGjv842fu3CauQMw',
				'AIzaSyBBZ5PfjvzlJmnJP6UOZwulnXkUka10jtU',
				'AIzaSyAQlkUmxuKywJhQHjhPeNqHq64x4GYboxU',
				'AIzaSyCfxoIPMR1XCX7oKQYHJUq1v7sJnIBU5Zo',
				'AIzaSyA7hNXWKhdQAsdJrA382YqdfwHdGOD4ERQ',
				'AIzaSyD0iTaXf4_7iwV-XwHHAR7G-NtegrOfJn0',
				'AIzaSyBfgNQ9uBdEgUaWBJQhupDVb37D8s5aIzQ',
				'AIzaSyB_vWuGUWaWWhktecHv4B4nz3aTNRjEx80',
				'AIzaSyBvZC8G3vNfydxNvgYRckIy26LdlndyMGM',
				'AIzaSyBisf0JQtCzfdE05v0J0hTUc3j89jjylWA',
				'AIzaSyC-8sfK-tKRyklKblFh8snjK3vLY2AVigE',
				'AIzaSyCH0q4aMCz2eQ5Tj7Z4JNUx5uBmEZ9kihA',
				'AIzaSyBXm-NF0xvl8wx2ocwTwXHjMFbd8D9ueLw',
				'AIzaSyAA9NumbHg8GdK96n5TPTqMQy3OIR4iFyo',
				'AIzaSyDPRuJ-PmFsLSVfxKHaW9PsGSeA-66rNoM',
				'AIzaSyAnCYbcREUmuRAXBWUuL0JnMP7i7CrfheI',
				'AIzaSyD3O6ABYrLRre-QKA5Bdbt35vPq_YbW9lE',
				'AIzaSyBycWZrgBNQnEzE_vVfgxKFjFDATDHf2og',
				'AIzaSyDJMz-7kjoFzd4EOGR3jCNGm5YTBoKkpjQ',
				'AIzaSyDYs6QWLjsqKZQnLzqJ7JxJH3Jw86kW6B0',
				'AIzaSyAIEE5W7GM1YswUlvV48gaawyfKcskm6fc',
				'AIzaSyBkJ5t2FylyMjcpnrkRY3Uc6f1WcukGmT0',
				'AIzaSyCtDXhHniJwtFu_F7v6PqjvHexYTbEF8jE',
				'AIzaSyC6mxhY7rOAd5fHRP6dO0fsALspXuSc8gQ',
				'AIzaSyAF2xScNQAFy6M3VDtTeDnADFKtdBMgl4k',
				'AIzaSyDn9wF2qFiY1HgY8LtgofaGPwPOiAtRMvI',
				'AIzaSyAyKDuReoMLdLBE_XMGO2BH4SGbbg8FFtQ',
				'AIzaSyCn9yXrxzi6l_7fgTaLc-vQK8JHQ1LPjyI',
				'AIzaSyB-2rd2RgBCJju0UzxamXnHv1hjsuzrmwM',
				'AIzaSyAZzr2ecgrTpGgR0X3DjM5xA9Gm1GCNyBw',
				'AIzaSyCtWmc3PF3q5eWcuKbYCUkjWOuZswaRe8s',
				'AIzaSyCY_4rtlHUr5nqVVQ--JYQ-iGQtkYc8Ja4',
				'AIzaSyBFyW9Zdinf2uKmEk1qYX0v3UGGx1T43N4',
				'AIzaSyAJjDj1sKSr0bnSasC3Kg9RfMXgNy0HjjM',
				'AIzaSyB27RMIbvGq3k72zSpb00pmqPko6OdhAn0',
				'AIzaSyAeRZkpdOlqX84NlQB8Fnp0uP2H6yGeTk8',
				'AIzaSyBizR_t7aWKw_aPZYyWzyhgA7dPTXa9wRY',
				'AIzaSyC1_u_aVAtmDt4k4hnMa-lybRGZxvgdrKI',
				'AIzaSyD4FR4fDEzcLDTyjwec0fBKaWfWFsy-X_Q',
				'AIzaSyCHai-NovQ7Axn63YsjkUMxGlr-NwHrKtU',
				'AIzaSyABE3vZJlZ4wVvR5FE_K_tUjcFI3v21HX0',
				'AIzaSyAW6v4iyX9Jp-E1F3YfqT8BWsd-ibszkNc',
				'AIzaSyA0ZJg4_K2mhuxCEBQTausY2UsNICvgCiI',
				'AIzaSyCxqSH8D3txfFhlpn5JIBCSF-kF7juO6LQ',
				'AIzaSyBXTo2WAvdiH245bxuSJi-XD7Qbq4XSvuE',
				'AIzaSyCaPB2HJULy_fcf3nIWRfI7_0OOUi-98T8',
				'AIzaSyDAKIT7fqfoYfLNtMXxWMI_ru-TofF46Rs',
				'AIzaSyBJ37BTXWsyAVhVpp6yUeZWLO_1UEU4EXo',
				'AIzaSyCGKBoEkQBGm04AwYCZ46X_uAUICJuDSRI',
				'AIzaSyDNMCIMaOJoieVJ_mZRk5Nolz7QKxG6BTE',
				'AIzaSyBRDtY8UyiuAVkosycyJ1jzvgI1lHNnDJ4',
				'AIzaSyCUbGZ37VLXjZqcihAarDpM50FcEmvxnOo',
				'AIzaSyD-L6S8RX_CclS9XpGj_aWuDyMs2tWNrQQ',
				'AIzaSyAE3T4u7kcGJEDxBAF_a4WC2e8F_A7EDn8',
				'AIzaSyD9xP9HnvGVRRomdF9ZkLoiBSpw-lBOVqQ',
				'AIzaSyA__sBIof6jLOj_SFw4f4EVpK3WAbGKeMw',
				'AIzaSyBlQBp9Ue6qPNwtRTObd_Cn3myILa6DF3o',
				'AIzaSyCw_Gc3TPm8UQ0Df7LFMz9hR49rgTwBI44',
				'AIzaSyB2-RYFjF0KNGkNofv0wq6ejFU61B-9aVo',
				'AIzaSyDgiDjKH8jBcH62K-tnbnlBgWNQ7RcBEI0',
				'AIzaSyDDsFheEvNbyGNtiebecMu77MOrE_y1ON0',
				'AIzaSyAaBLPIJYhKTHb1ZLDVuoPme9qbIlCmjnw',
				'AIzaSyDMAGXcA_p7l2D8nT8QQARmAVfOiNkSHcA',
				'AIzaSyCUOGxSY1IuH4qXhJo1K0ZZN5Y_ebK1CLU',
				'AIzaSyADslOC4Ze92pewSzfD7yZYdCBrCbKuNkU',
				'AIzaSyADslOC4Ze92pewSzfD7yZYdCBrCbKuNkU',
				'AIzaSyCyx0JGNcZIJN8DJJ-WckZxxlOYSdvtAWs',
				'AIzaSyC04_4O4l34A6cuCVpg2PgbolukaC6yN0k'
				];

exports.saveSpotToText = function(req,res){
	var title = req.query.title;
	var ep = new EventProxy();
	ep.all('att','rest','shop', function (att, rest,shop) {
		// console.log(att.length);
		// console.log(rest.length);
		// console.log(shop.length);
		var attStr = [];
		for(var i=0;i<att.length;i++){
		  attStr.push({_id:att[i]._id,type:'0',city_name:att[i].cityname,latitude:att[i].latitude,longitude:att[i].longitude});
		}
		var restStr = [];
		for(var i=0;i<rest.length;i++){
			restStr.push({_id:rest[i]._id,type:'1',city_name:rest[i].city_name,latitude:rest[i].latitude,longitude:rest[i].longitude});
		}
		var shopStr = [];
		for(var i=0;i<shop.length;i++){
			shopStr.push({_id:shop[i]._id,type:'2',city_name:shop[i].city_name,latitude:shop[i].latitude,longitude:shop[i].longitude});
		}
		var logStr = 'exports.items=' + JSON.stringify(attStr.concat(restStr).concat(shopStr));
		logStr += ';';
		if(!title)
			title = 'result';
		fs.appendFileSync('./data/path/'+title+'.js', logStr,[], function (err) {
		  if (err) throw err;
		  console.log('The "data to append" was appended to file!');
		  res.send('ok! file = /data/path'+title+'.js');
		});
    
  }).fail(function(err){
  	console.log(err);
  });
  Attractions.getAttractionsByQuery({cityid:newyork},{cityname:1,latitude:1,longitude:1,},ep.done('att'));
  Restaurant.getRestaurantsByOptions({city_id:new ObjectID(newyork)},{city_name:1,latitude:1,longitude:1},ep.done('rest'));
  Shopping.getShoppingsByOptions({city_id:new ObjectID(newyork)},{city_name:1,latitude:1,longitude:1},ep.done('shop'));
};

exports.importPathToDB = function(req,res){
	var title = req.query.title;
	if(!title){
		title = 're';
	}
	var items = require('../data/path/data/restaurants/' + title).items;
	var n = items.length * (items.length-1);


	var itemss = require('../data/path/data/restaurants/' + title + 'res').items;

	var ep = new EventProxy();
	ep.after('save', n , function(list){
		console.log(list);
		console.log('________________________________________________________________');
	}).fail(function(err){
		console.log('failed!');
	});
	for(var i=0;i<items.length;i++){
		for(var j=0;j<itemss.length;j++){
			if(true){
				var one = {};
				one.city_id = newyork;
				one.city_name = items[i].city_name;
				one.a_id = items[i]._id;
				one.a_latitude = items[i].latitude;
				one.a_longitude = items[i].longitude;
				one.a_type = items[i].type;
				one.b_id = itemss[j]._id;
				one.b_latitude = itemss[j].latitude;
				one.b_longitude = itemss[j].longitude;
				one.b_type = itemss[j].type;
				saveOnePath(one, ep.done('save'));
				sleep.usleep(600);
				console.log(i + ':' + j);
			}
		}
	}
	console.log(items.length);
};







exports.importPathToDBSync = function(req, res) {
	var title = req.query.title;
	if(!title){
		title = 'result';
	}
	var items = require('../data/path/'+title).items;
	var n = items.length * (items.length-1);
	for(var i=0;i<items.length;i++){
		for(var j=0;j<items.length;j++){
			if(i!=j){
				var one = {};
				one.city_id = newyork;
				one.city_name = items[i].city_name;
				one.a_id = items[i]._id;
				one.a_latitude = items[i].latitude;
				one.a_longitude = items[i].longitude;
				one.a_type = items[i].type;
				one.b_id = items[j]._id;
				one.b_latitude = items[j].latitude;
				one.b_longitude = items[j].longitude;
				one.b_type = items[j].type;
				saveOnePath(one, function(err, data) {
					if (err) {
						console.log(err);
					} else {
						console.log(i + ':' + j);
					}
				});
				sleep.usleep(1000);
				
			}
		}
	}
	//console.log(items.length);
};







function saveOnePath(one,callback){
	Path.newAndSave(one,callback);
}

function getOneEmptyPath (mode, callback) {
	Path.getOneWithEmptySteps(mode, callback);
}

function getOneEmptyPathSync(mode, skip, limit, callback) {
	Path.getOneWithEmptyStepsSync(mode, skip, limit, callback);
}

function getDistanceDurations(callback) {
	Path.getDistanceDurations(callback);
}

function getTaxiFare (callback) {
	Path.getTaxiFare(callback);
}



function execTaxiFare() {
	getTaxiFare(function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var arraycount = data.length;
			if (arraycount > 0) {
				for (var i = 0; i < arraycount; i ++) {
					
					var one = data[i];

					var city_name = one.city_name;

					var citymodel = gettaxiFareModel(city_name);

					var distance = one.driver.distance;
					var duration = one.driver.duration;

					console.log("distance : " + distance + " duration : " + duration);

					var taxifare = 0;

					if (distance != 0 && duration != 0) {
						taxifare = getCommonTaxiFare(distance, duration, citymodel);
						// console.log(taxifare);
					}

					one.driver.taxifare = taxifare;
					// console.log(one.driver.taxifare);
					one.save(function(err, one_data){
						if (err) {
							console.log("get the data to database error,fail to read");
						}
						console.log(one_data._id);
						console.log(one_data.driver.taxifare);
						console.log("update success!");
					});
				}
				sleep.usleep(100);
				execTaxiFare();
			} else {
				console.log("exec ended!!!");
			}
		}
	});
}

// execTaxiFare();

// var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

// function generateMixed(n) {
//      var res = "";
//      for(var i = 0; i < n ; i ++) {
//          var id = Math.ceil(Math.random()*35);
//          res += chars[id];
//      }
//      return res;
// }


function testOnePage() {
	getDistanceDurations(function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var arraycount = data.length;
			if (arraycount > 0) {
				for (var i = 0; i < arraycount; i ++) {
					var one = data[i];
					var steps = one.bus.steps;

					var distance = 0;
					var duration = 0;

					for (var j = 0; j < steps.length; j ++) {

						if (steps[j].distance != undefined && steps[j].duration != undefined) {
							distance += steps[j].distance.value;
							duration += steps[j].duration.value;
						}
						

						// console.log("---------------------");
						// console.log("distance : " + steps[j].distance.value);
						// console.log("duration : " + steps[j].duration.value);
					}
					one.bus.distance = distance;
					one.bus.duration = duration;


					one.save(function(err, data){
						if (err) {
							console.log("get the data to database error,fail to read");
						}
						console.log(one_data.driver.distance);
						console.log("update success!");
					});
				}
				console.log(generateMixed(15));
				sleep.usleep(100);
				testOnePage();
			} else {
				console.log("exec ended!!!");
			}
			

		}
	});
}

// testOnePage();



var https = require('https');

var apiurl = 'https://maps.googleapis.com/maps/api/directions/json';

function getGoogleUrl(o, d, mode, sensor, key) {
	var url = apiurl;
	url += "?origin=" + o;
	url += "&destination=" + d;
	url += "&mode=" + mode;
	var departure_time = Math.round(new Date().getTime()/1000);
	url += "&departure_time=" + departure_time;
	url += "&sensor=" + sensor;
	url += "&key=" + key;
	return url;
}

function gettaxiFareModel(city_name) {
	var citymodels = [
		{"name": "Common", "initialcharge": "2.00", "permilecharge": "2.00", "currency": "USD", "triffic": "0", "tip": "0", "tax": "0"},
		{"name": "苏黎世", "initialcharge": "6.00", "permilecharge": "4.36", "currency": "CHF", "triffic": "0", "tip": "0", "tax": "0"},
		{"name": "巴塞罗那", "initialcharge": "2.00", "permilecharge": "1.18", "currency": "EUR", "triffic": "0", "tip": "0", "tax": "0"},
		{"name": "纽约", "initialcharge": "2.50", "permilecharge": "2.10", "triffic": "0.40", "tax": "0.50", "currency": "USD", "tip": "0.2"},
		{"name": "巴黎", "initialcharge": "2.30", "permilecharge": "2.3", "triffic": "0", "currency": "EUR", "tax": "0", "tip": "0.1"},
		{"name": "罗马", "initialcharge": "2.80", "permilecharge": "0.80", "triffic": "0", "currency": "EUR", "tip": "0.1", "tax": "0"},
		{"name": "伦敦", "initialcharge": "2.40", "permilecharge": "2.28", "triffic": "0", "currency": "GBP", "tip": "0", "tax": "0"},
		{"name": "日内瓦", "initialcharge": "6.30", "permilecharge": "4.66", "triffic": "0", "currency": "CHF", "tip": "0", "tax": "0"},
		{"name": "旧金山", "initialcharge": "3.50", "permilecharge": "2.33", "triffic": "0.40", "tax": "0.50", "currency": "USD", "tip": "0.2"},
		{"name": "洛杉矶", "initialcharge": "2.85", "permilecharge": "1.70", "triffic": "0.40", "tax": "0", "currency": "USD", "tip": "0.15"},
		{"name": "新加坡", "initialcharge": "3.00", "permilecharge": "0.84", "triffic": "0", "currency": "SGD", "tip": "0", "tax": "0"},
		{"name": "东京", "initialcharge": "710", "permilecharge": "293", "triffic": "0", "currency": "JPY", "tax": "0", "tip": "0"},
		{"name": "大阪", "initialcharge": "660", "permilecharge": "290", "triffic": "0", "currency": "JPY", "tax": "0", "tip": "0"},
		{"name": "马德里", "initialcharge": "2.10", "permilecharge": "1.40", "triffic": "0", "currency": "EUR", "tax": "0", "tip": "0"},
		{"name": "温哥华", "initialcharge": "3.20", "permilecharge": "2.62", "triffic": "0", "currency": "CAD", "tax": "0", "tip": "0.15"},
		{"name": "芝加哥", "initialcharge": "4.00", "permilecharge": "1.70", "currency": "USD", "triffic": "0", "tip": "0.15", "tax": "0"},
		{"name": "曼彻斯特", "initialcharge": "2.40", "permilecharge": "2.10", "triffic": "0", "currency": "GBP", "tip": "0", "tax": "0"},
		{"name": "波士顿", "initialcharge": "2.60", "permilecharge": "2.10", "triffic": "0.47", "currency": "USD", "tip": "0.15"},
		{"name": "尼斯", "initialcharge": "6.40", "permilecharge": "3.4", "triffic": "0", "currency": "EUR", "tip": "0", "tax": "0"},
		{"name": "圣地亚哥", "initialcharge": "2.80", "permilecharge": "2.23", "triffic": "0", "currency": "USD", "tip": "0", "tax": "0"},
		{"name": "慕尼黑", "initialcharge": "2.90", "permilecharge": "1.92", "triffic": "0", "currency": "EUR", "tip": "0.1", "tax": "0"},
		{"name": "柏林", "initialcharge": "4.00", "permilecharge": "1.46", "triffic": "0", "currency": "EUR", "tip": "0.1", "tax": "0"},
		{"name": "多伦多", "initialcharge": "4.25", "permilecharge": "2.52", "triffic": "0", "currency": "CAD", "tip": "0.15", "tax": "0"},
		{"name": "法兰克福", "initialcharge": "2.80", "permilecharge": "2.10", "triffic": "0", "currency": "EUR", "tax": "0", "tip": "0.1"},
		{"name": "悉尼", "initialcharge": "3.50", "permilecharge": "2.14", "permilechargenight": "2.57", "surcharge" : "2.50", "triffic": "0", "currency": "AUD", "tax": "0", "tip": "0"}
	];

	for (var i = 0; i < citymodels.length; i ++) {
		if (citymodels[i].name == city_name) {
			return citymodels[i];
			break;
		}
		return citymodels[0];
	};
}

// console.log(gettaxiFareModel("苏黎世d"));




/**
taxi fare
**/
function getTokyoTaxiFare(distance, duration, options)
{
	var estimatedfare = 0;
	estimatedfare = getCommonTaxiFareWithoutTip(distance, duration, options);
	if (estimatedfare > 9000) {
		estimatedfare = estimatedfare * 0.9;
	}
	return estimatedfare;
}

function getSanfranciscoTaxiFare(distance, duration, options) {
	var estimatedfare = 0;
	estimatedfare = getCommonTaxiFare(distance, duration, options);
	return estimatedfare;
}

function getSyndeyTaxiFare(distance, duration, departuretime, options) {
	//departuretime must be local time
	var now = new Date(parseInt(departuretime) * 1000);
	var day = now.getDay();
	var hour = now.getHours();

	var estimatedfare = 0;
	estimatedfare = getCommonTaxiFareWithoutTip(distance, duration, options);
	if ((day == 5 || day == 6) && hour > 19) {
		estimatedfare += options.surcharge;
	}
	estimatedfare += estimatedfare * options.tip;
	return estimatedfare;
}

function getCommonTaxiFareWithoutTip(distance, duration, options) {
	var estimatedfare = 0;
	estimatedfare = accAdd(estimatedfare, options.initialcharge);
	estimatedfare = accAdd(estimatedfare, accMul(options.permilecharge, accDiv(distance, 1000)) );
	estimatedfare = accAdd(estimatedfare, accMul(options.triffic, accDiv(duration, 60)) );
	estimatedfare = accAdd(estimatedfare, options.tax);
	return estimatedfare;
}

function getCommonTaxiFare(distance, duration, options)
{
	var estimatedfare = 0;
	estimatedfare = accAdd(estimatedfare, options.initialcharge);
	estimatedfare = accAdd(estimatedfare, accMul(options.permilecharge, accDiv(distance, 1000)) );
	estimatedfare = accAdd(estimatedfare, accMul(options.triffic, accDiv(duration, 60)) );
	estimatedfare = accAdd(estimatedfare, options.tax);
	estimatedfare = accAdd(estimatedfare, accMul(estimatedfare, options.tip) );
	return estimatedfare;
}

// var testdistance = 7500;
// var testduration = 1200;
// var testoptions = {"name": "东京", "initialcharge": "710", "permilecharge": "320", "triffic": "0", "currency": "JPY", "tax": "0", "tip": "0"};
// var testresult = getCommonTaxiFare(testdistance, testduration, testoptions);
// console.log(testresult);



////////////////////////////////////////////////////

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}


/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}



/** 
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}




function getGoogleUrlTimezone(cityname, o, d, mode, sensor, key) {
	var cities = [
	'苏黎世',
	'巴塞罗那',
	'纽约',
	'巴黎',
	'罗马',
	'伦敦',
	'威尼斯',
	'日内瓦',
	'旧金山',
	'洛杉矶',
	'新加坡',
	'东京',
	'大阪',
	'马德里',
	'温哥华',
	'芝加哥',
	'曼彻斯特',
	'波士顿',
	'尼斯',
	'圣地亚哥',
	'慕尼黑',
	'柏林',
	'多伦多',
	'法兰克福',
	'悉尼',
	];
	var citytimezone = [
	-6,
	-6,
	-12,
	-6,
	-6,
	-7,
	-6,
	-6,
	-15,
	-15,
	0,
	1,
	1,
	-6,
	-15,
	-13,
	-7,
	-12,
	-6,
	-15,
	-6,
	-6,
	-12,
	-6,
	2
	];

	var offsettime = 0;
	for (var i = 0; i < cities.length; i++) {
		if (cityname == cities[i]) {
			offsettime = citytimezone[i] * 3600;
		}
	};


	var url = apiurl;
	url += "?origin=" + o;
	url += "&destination=" + d;
	url += "&mode=" + mode;
	
	var datetime = '2014-06-24 10:10:10';
	var departure_time = datetime_to_unix(datetime) + offsettime; 

	// var departure_time = Math.round(new Date().getTime()/1000) + offsettime;

	url += "&departure_time=" + departure_time;
	url += "&sensor=" + sensor;
	url += "&key=" + key;
	return url;

}


function datetime_to_unix(datetime){
    var tmp_datetime = datetime.replace(/:/g,'-');
    tmp_datetime = tmp_datetime.replace(/ /g,'-');
    var arr = tmp_datetime.split("-");
    var now = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    return parseInt(now.getTime()/1000);
}
 
function unix_to_datetime(unix) {
    var now = new Date(parseInt(unix) * 1000);
    return now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}


function mydownload(url, obj, index, count, callback) {
	var req = https.request(url, function(res) {
	  // console.log("statusCode: ", res.statusCode);
	  // console.log("headers: ", res.headers);
	  var data = "";
	  res.on('data', function(d) {
	  	data += d;
	    // process.stdout.write(d);
	    if(data.length > 100000000)
        res.emit('end');

	  });
	  res.on("end", function() {
	  	callback(null, data, obj, index, count);
	  });

	});
	req.end();

	req.on('error', function(e) {
	  console.log('error');
	  callback(null);
	});
}


exports.autoReloadPage = function (req, res) {

	sleep.sleep(4);
	var achangekey = false;
	achangekey = true;
	res.render("index", {test:"hello,world", url : "aaaa", changekey : achangekey});
}

exports.runFillTaskQueen = function(req, res) {
	
	var mode = req.query.mode;
	var kk = req.query.key;
	var googlekey = googlekeys[kk];
	var skip = req.query.skip;
	var limit = req.query.limit;

	var changekey = false;
	
	getOneEmptyPathSync(mode, skip, limit, function(err, data) {
		if (err) {
			res.send(err);
		} else {
			if (!data) {
				//stop the request google
				res.send("no data");

			} else {
				// res.send(data);
				//fetch google maps api
				var epcount = data.length;

				// res.send(data);


				// var ep = new EventProxy();
				// ep.after('save', epcount, function(list){
				// 	console.log(list);
				// 	console.log('save success!');
				// }).fail(function(err){
				// 	console.log(err);
				// });

				for (var i = 0; i < epcount; i ++) {

					(function(k) {

						var o = data[k].a_latitude + ',' + data[k].a_longitude;
						var d = data[k].b_latitude + ',' + data[k].b_longitude;
						var one = data[k];


						if (data[k].b_latitude || data[k].b_longitude || data[k].a_latitude || data[k].a_longitude) {

							var googlemode = "transit";
							var sensor = "false";
							var cityname = data[k].city_name;
							console.log(cityname);
							// var myurl = getGoogleUrlTimezone(cityname, o, d, googlemode, sensor, googlekey);
							var myurl = getGoogleUrl(o, d, googlemode, sensor, googlekey);
							console.log('(________' + k + '________)' + myurl);
							
							
							mydownload(myurl, one, k, epcount, function(error, data) {
								if (error) {
									console.log("fetch the google api error, VPN or connection ");
									return;
								} else {
									// console.log(data);
									if (data != undefined) {

										var inner_data = JSON.parse(data);

										if (inner_data.status == "OK") {
											var legs = inner_data.routes[0].legs[0];
											var steps = [];
											steps = legs.steps;
											// for (var mini = 0; mini < legs.steps.length; mini++) {
						     //                   steps.push(getStepObjByGmInfo(legs.steps[mini]));
						     //                   // one.bus.steps.push(getStepObjByGmInfo(legs.steps[mini]));
						     //               	}

											// one.bus.steps = steps;
											one.bus.steps = steps;

											//meters
											one.bus.duration = legs.duration.value;

											//seconds
											one.bus.distance = legs.distance.value;


											one.driver.legs = legs;
											// console.log(one);

											// saveOnePath(obj, ep.done('save'));
											var path = new PathsModel();
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
											path.bus = one.bus;
											path.driver = one.driver;
											path.walk = one.walk;
											one.save(function(err, one_data){
												if (err) {
													console.log("get the data to database error,fail to read");
												}
												console.log("update success!");
											});
										} else if (inner_data.status == "NOT_FOUND") {


											var steps = [];
											

											steps.push({ html : "Google Not Found"});

											// one.bus.steps = steps;
											one.bus.steps = steps;
											//meters
											one.bus.duration = 0;

											//seconds
											one.bus.distance = 0;

											// console.log(one);

											// saveOnePath(obj, ep.done('save'));
											var path = new PathsModel();
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
											path.bus = one.bus;
											path.driver = one.driver;
											path.walk = one.walk;
											one.save(function(err, one_data){
												if (err) {
													console.log("get the data to database error,fail to read");
												}
												console.log("Google not found data");
											});



										} else if (inner_data.status == "REQUEST_DENIED") {


											



										} else if (inner_data.status == "ZERO_RESULTS") {



											var steps = [];
											

											steps.push({ html : "Zero results errors"});

											// one.bus.steps = steps;
											one.bus.steps = steps;
											//meters
											one.bus.duration = 0;

											//seconds
											one.bus.distance = 0;
											// console.log(one);

											// saveOnePath(obj, ep.done('save'));
											var path = new PathsModel();
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
											path.bus = one.bus;
											path.driver = one.driver;
											path.walk = one.walk;
											one.save(function(err, one_data){
												if (err) {
													console.log("get the data to database error,fail to read");
												}
												console.log("Google zero results");
											});



											
										} else if (inner_data.status == "OVER_QUERY_LIMIT") {
											changekey = true;
										}
										 else {

											console.log("data error " + inner_data.status);
										}
										if( k == epcount - 1) {

											var redurl = '/runFillTaskQueen?';
											var modee = mode;
											var skipp = skip;
											var limitt = limit;
											var changekeyy = changekey;
											if (changekey) {
												changekey = false;
											}
											res.render('index', {url : redurl, test : "hello,world", changekey : changekeyy, mode : modee, skip : skipp, limit : limitt, key : kk});
										}

									} else {
										console.log("Google maps api error, please stop~");
									}
								}
								



							});
							// sleep.usleep(1000);
							sleep.usleep(10000);

							////////////////


						} else {


							var steps = [];
											

							steps.push({html : "Geo data error"});

							// one.bus.steps = steps;
							one.bus.steps = steps;
							//meters
							one.bus.duration = legs.duration.value;

							//seconds
							one.bus.distance = legs.distance.value;

							// console.log(one);

							// saveOnePath(obj, ep.done('save'));
							var path = new PathsModel();
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
							path.bus = one.bus;
							path.driver = one.driver;
							path.walk = one.walk;


							one.save(function(err, one_data){
								if (err) {
									console.log("get the data to database error,fail to read");
								}
								console.log("Error data saved!");
							});






							/////////// geo data error





						}
						

					})(i);
				
				}

			}
		}
	});




	// for (var i = 0; i < 3600; i++) {
	// 	console.log(i + "...");
	// 	sleep.sleep(2);
	// };



	//res.send("pending...");

};

function getStepObjByGmInfo(step){
	var mystep = {};
	mystep.travel_mode = step.travel_mode;
	mystep.duration = step.duration.text;
	mystep.distance = step.distance.text;
	mystep.html = step.html_instructions;
	return mystep;
}


//////////////////////////////////////////分割线
