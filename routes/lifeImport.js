var barcelona = require('../data/life/shopping/barcelona_data'); //ID:516a3519f8a6461636000003,巴塞罗那
var geneva = require('../data/life/shopping/geneva_data'); //ID:516a35218902ca1936000003,日内瓦
var london = require('../data/life/shopping/london_data'); //ID:516a35218902ca1936000005,伦敦
var losangeles = require('../data/life/shopping/losangeles_data');//ID:516a34f958e3511036000003,洛杉矶
var newyork = require('../data/life/shopping/newyork_data'); //ID:516a34f958e3511036000001,纽约
// var paris = require('../data/life/shopping/paris_data');//ID:516a350ec221c21236000003,巴黎
var roma = require('../data/life/shopping/roma_data');//ID:51d3d238e98bbb566a000001,罗马
var sanfrancisco = require('../data/life/shopping/sanfrancisco_data');//ID:516a34f958e3511036000002,旧金山
var singapore = require('../data/life/shopping/singapore_data');//ID:516a3535dac6182136000004,新加坡
var zurich = require('../data/life/shopping/zurich_data'); //ID:516a35218902ca1936000002,苏黎世
var venezia = require('../data/life/shopping/venezia_data');//ID:516a3519f8a6461636000001,威尼斯
var paris = require('../data/life/shopping/paris_shoppings');//ID:52e62f8e4e59f08771000009 Oahu

var newyork_m = require('../data/life/restaurant/michilin/newyorkmichelin_data');
var barcelona_m = require('../data/life/restaurant/michilin/barcelonamichelin_data');
var geneva_m = require('../data/life/restaurant/michilin/genevamichelin_data');
var london_m = require('../data/life/restaurant/michilin/londonmichelin_data');
var losangeles_m = require('../data/life/restaurant/michilin/losangelesmichelin_data');
var paris_m = require('../data/life/restaurant/michilin/parismichelin_data');
var roma_m = require('../data/life/restaurant/michilin/romamichelin_data');
var sanfranciscoa_m = require('../data/life/restaurant/michilin/sanfranciscomichelin_data');
var singapore_m = require('../data/life/restaurant/michilin/singaporemichelin_data');
var zurich_m = require('../data/life/restaurant/michilin/zurichmichelin_data');
var venezia_m = require('../data/life/restaurant/michilin/veneziamichelin_data');

var barcelona_k = require('../data/life/restaurant/full/barcelona_1000restaurants_data');
var newyork_k = require('../data/life/restaurant/full/newyork_1000restaurants_data');
var london_k = require('../data/life/restaurant/full/Londonnn_10000restaurants_data');
var losangeles_k = require('../data/life/restaurant/full/losangeles_1000restaurants_data');
var paris_k = require('../data/life/restaurant/full/paris_1000restaurants_data');
var roma_k = require('../data/life/restaurant/full/roma_1000restaurants_data');
var sanfrancisco_k = require('../data/life/restaurant/full/sanfrancisco_1000restaurants_data');
var zurich_k = require('../data/life/restaurant/full/zurich_1000restaurants_data.js');

var chicago_k = require('../data/life/restaurant/full/chicago_1000restaurants_data.js');
var madrid_k = require('../data/life/restaurant/full/madrid_1000restaurants_data.js');
var sydney_k = require('../data/life/restaurant/full/sydney_1000restaurants_data.js');
var tokyo_k = require('../data/life/restaurant/full/tokyo_1000restaurants_data.js');
var frankfurt_k = require('../data/life/restaurant/full/frankfurt_1000restaurants_data.js');
var boston_k = require('../data/life/restaurant/full/boston_1000restaurants_data.js');
var osaka_k = require('../data/life/restaurant/full/osaka_1000restaurants_data.js');

var berlin_k = require('../data/life/restaurant/full/berlin_1000restaurants_data.js');
var nice_k = require('../data/life/restaurant/full/Nice_1000restaurants_data.js');
var sandiego_k = require('../data/life/restaurant/full/Sandiego_1000restaurants_data.js');
var toronto_k = require('../data/life/restaurant/full/Toronto_1000restaurants_data.js');
var vancouver_k = require('../data/life/restaurant/full/Vancouver_1000restaurants_data.js');
var munich_k = require('../data/life/restaurant/full/Munich_1000restaurants_data.js');
var manchester_k = require('../data/life/restaurant/full/Manchester_10000restaurants_data.js');

var oahu = require('../data/life/restaurant/Oahu_restaurants');


var CategoryR = require('../data/life/restaurant/category_restaurant');
var CategoryS = require('../data/life/shopping/category_shopping');
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var EventProxy = require('eventproxy');
var Restaurant = require('../proxy').Restaurant;
var RestaurantModel = require('../models').Restaurant;
var ShoppingModel = require('../models').Shopping;
var Category = require('../proxy').Category;
var Brand = require('../proxy').Brand;
var RecommendInfo = require('../proxy').RecommendInfo;
var Pgc = require('../proxy').Pgc;
var Banner = require('../proxy').Banner;
var Activity = require('../proxy').Activity;
var Bigtype = require('../proxy').Bigtype;
var count = 0;
var bigs = require('../data/life/big');

function getInitData(){
	var cityItems = [];
	// cityItems.push({cityname:'曼彻斯特',cityid:'516a352b625d8b1e36000001',items:manchester_k.items});	
	// cityItems.push({cityname:'欧胡岛',cityid:'52e62f8e4e59f08771000009',items:oahu.items});
	cityItems.push({cityname:'欧胡岛',cityid:'52e62f8e4e59f08771000009',items:oahu.items});
	// cityItems.push({cityname:'柏林',cityid:'516a3519f8a6461636000004',items:berlin_k.items});
	// cityItems.push({cityname:'尼斯',cityid:'516a350fc221c21236000005',items:nice_k.items});
	// cityItems.push({cityname:'圣地亚哥',cityid:'5308cb32d05b06507f00009b',items:sandiego_k.items});
	// cityItems.push({cityname:'多伦多',cityid:'516a350ec221c21236000002',items:toronto_k.items});
	// cityItems.push({cityname:'温哥华',cityid:'516a350ec221c21236000001',items:vancouver_k.items});
	// cityItems.push({cityname:'慕尼黑',cityid:'516a35208902ca1936000001',items:munich_k.items});

	// cityItems.push({cityname:'芝加哥',cityid:'516a34fa58e3511036000004',items:chicago_k.items});
	// cityItems.push({cityname:'马德里',cityid:'516a3519f8a6461636000002',items:madrid_k.items});
	// cityItems.push({cityname:'悉尼',cityid:'52e0f1efb64f047135000003',items:sydney_k.items});
	// cityItems.push({cityname:'东京',cityid:'516a352b625d8b1e36000002',items:tokyo_k.items});
	// cityItems.push({cityname:'法兰克福',cityid:'516a3519f8a6461636000005',items:frankfurt_k.items});
	// cityItems.push({cityname:'波士顿',cityid:'516a34fa58e3511036000005',items:boston_k.items});
	// cityItems.push({cityname:'大阪',cityid:'516a352b625d8b1e36000003',items:boston_k.items});

	//cityItems.push({cityname:'巴塞罗那',cityid:'516a3519f8a6461636000003',items:barcelona_k.items});
	// cityItems.push({cityname:'伦敦',cityid:'516a35218902ca1936000005',items:london_k.items});
	//cityItems.push({cityname:'洛杉矶',cityid:'516a34f958e3511036000003',items:losangeles_k.items});
	//cityItems.push({cityname:'巴黎',cityid:'516a350ec221c21236000003',items:paris_k.items});
	//cityItems.push({cityname:'罗马',cityid:'51d3d238e98bbb566a000001',items:roma_k.items});
	//cityItems.push({cityname:'旧金山',cityid:'516a34f958e3511036000002',items:sanfrancisco_k.items});
	//cityItems.push({cityname:'苏黎世',cityid:'516a35218902ca1936000002',items:zurich_k.items});
	return cityItems;
}

exports.initCategoryData = function(){
	// Category.getCategorysByType('1',function(err,categorys){
		Category.getCategorysByQuery({},function(err,categorys){
		if(categorys){
			global.categorys = categorys;
			console.log('global.categorys='+global.categorys.length);
			// exports.initBigtypeData();
		}
	});
};

// exports.initBigtypeData = function(){
// 	for(var i=0;i<bigs.items.length;i++){
// 		var _ids = [];
// 		for(var k=0;k<bigs.items[i].categorys.length;k++){
// 			for(var j=0;j<global.categorys.length;j++){
// 				if(bigs.items[i].categorys[k]== global.categorys[j].en_name){
// 					_ids.push(global.categorys[j]._id);
// 				}
// 			}
// 		}
// 		bigs.items[i]._ids = _ids;
		
// 	}
// 	global.bigs = bigs.items;
// 	// console.log(bigs);
// 	for(var i=0;i<global.bigs.length;i++){
// 		(function(k){
// 			Category.getCategoryByEnName(global.bigs[k].en_name,function(err,one){
// 				global.bigs[k]._id = one._id;
// 			}); 
// 		})(i);
// 	}
// };

// exports.saveRestaurantCategory = function(req,res){
// 	var flag = req.query.flag;
// 	var cityItems = getInitData();
// 	if(flag){

// 		Restaurant.getRestaurantsByQuery({city_id:cityItems[10].cityid},function(err,data){
// 			var ep = new EventProxy();
// 			ep.bind('error', function (err) {
// 		        ep.unbind();
// 		        console.log("you wenti !");
// 		        res.send('err');
// 		    });
// 		    ep.after('saveAll',data.length,function(list){
// 		    	res.send(list);
// 		    });
// 			for(var i=0;i<data.length;i++){
// 				(function(k){
// 					for(var j=0;j<data[k].category.length;j++){
// 						delete data[k].category[j]._ids;
// 						delete data[k].category[j].categorys;
// 					}
// 					data[k].save(function(err){
// 						ep.emit('saveAll',data[k]);
// 					});
// 				})(i);
// 			}
// 		});
// 	}else{
// 		res.send('err');
// 	}
// };

exports.getMichilin = function(req,res){
	var items = newyork_m.items,cityname='纽约',cityid='516a34f958e3511036000001';
	// var items = barcelona_m.items,cityname='巴塞罗那',cityid='516a3519f8a6461636000003';          
	// var items = geneva_m.items,cityname='日内瓦',cityid='516a35218902ca1936000003';
	// var items = london_m.items,cityname='伦敦',cityid='516a35218902ca1936000005';
	// var items = losangeles_m.items,cityname='洛杉矶',cityid='516a34f958e3511036000003';
	// var items = paris_m.items,cityname='巴黎',cityid='516a350ec221c21236000003';
	// var items = roma_m.items,cityname='罗马',cityid='51d3d238e98bbb566a000001';
	// var items = sanfranciscoa_m.items,cityname='旧金山',cityid='516a34f958e3511036000002';
	// var items = singapore_m.items,cityname='新加坡',cityid='516a3535dac6182136000004';
	// var items = zurich_m.items,cityname='苏黎世',cityid='516a35218902ca1936000002';
	var items = venezia_m.items,cityname='威尼斯',cityid='516a3519f8a6461636000001';

	var ep = new EventProxy();
	var c = [];
	ep.after('getM',items.length,function(list){
		res.send({length:items.length,found:c});
	});
	ep.bind('error', function (err) {
        ep.unbind();// 卸载掉所有handler
        console.log("you wenti !");
        callback(err);// 异常回调
    });
    var images = [];
	for(var i=0;i<items.length;i++){
		(function(k){
			var item = items[k];
			Restaurant.getRestaurantByName(item.ogtitle,function(err,result){
				if(result){
					result.michilin_flag = true;
					result.save(function(err){
						console.log(++count + ' over!');
						c.push(result.name);
						ep.emit('getM');
					})
				}
				else{
					importRestaurantMichilin(images,cityname,cityid,item,function(){
						ep.emit('getM');
					});
				}
			});
		})(i);
	}
};

function importRestaurantMichilin(images,cityname,cityid,item,callback){
	if(isNotNull(item.ogtitle)){
				var one = new RestaurantModel();
				one.name = item.ogtitle;
				one.city_id = cityid;
				one.city_name = cityname;
				// one.ranking = item.ranking;
				if(item.placelocationlongitude && item.placelocationlatitude){
					one.longitude = item.placelocationlongitude;
					one.latitude = item.placelocationlatitude;
				}
				if(isNotNull(item.categorystrlist)){
					one.category = getCategory(item.categorystrlist);
				}

				if(isNotNull(item.ogimage)){
					var fileName = getImageFileName(item.ogimage);
					var image = {
						fileName:fileName,
						image:item.ogimage
					}
					images.push(image);
					one.cover_image = fileName;
					one.image.push(fileName);
					writeImgFile(image,cityname);
				}

				if(isNotNull(item.ogdescription)){
					one.introduce = item.ogdescription;
				}

				if(isNotNull(item.address)){
					one.address = replaceBR(item.address);
				}

				if(isNotNull(item.postalcode)){
					one.postal_code = item.postalcode;
				}

				if(isNotNull(item.telephone)){
					one.tel = item.telephone;
				}

				if(isNotNull(item.website)){
					one.website = item.website;
				}

				if(isNotNull(item.avgprice)){
					one.price_desc = getPriceDesc(item.avgprice)
				}
				if(isNotNull(item.pricelevel)){
					one.price_level = getPriceLevel(item.pricelevel);
				}
				
				if(isNotNull(item.hours) && item.hours.length!=0){
					one.open_time = getOpenTime(item.hours);
				}

				if(!isEmptyObject(item.businessinfos)){
					one.info = getInfo(item.businessinfos);
				}

				if(isNotNull(item.rating)){
					one.rating = parseFloat(item.rating);
				}

				if(isNotNull(item.reviewcount)){
					one.reviews = parseInt(item.reviewcount);
				}

				if(isNotNull(item.reviewcomment)){
					one.comments.push(item.reviewcomment);
				}

				if(isNotNull(item.ogurl)){
					one.url = item.ogurl;
				}

				one.michilin_flag = true;
				// console.log(one);
				one.save(function(err){
					// console.log(restaurant);
					console.log(++count+' over!');
					callback(null,one);
				});
			}else{
				callback('not title');
			}
}

exports.getTopCategoryByCity = function(req,res){
	var cityname = req.params.cityname;
	Restaurant.getRestaurantsByQuery({'city_name':cityname},function(err,result){
		if(result){
			var a = [];
			for(var i=0;i<result.length;i++){
				var category = result[i].category;
				if(category){
					for(var k=0;k<category.length;k++){
						var index = indexArray(category[k],a);
						if(index==-1){
							a.push(category[k]);
							a[a.length-1].count = 1;
						}else{
							a[index].count++;
							console.log('aaa');
						}
						
					}
				}
			}

			for(var i=0;i<a.length-1;i++){
				for(var j=0;j<a.length-1-i;j++){
					if(a[j].count<a[j+1].count){
						var t = a[j];
						a[j] = a[j+1];
						a[j+1] = t;
					}
				}
			}

			for(var i=0;i<a.length;i++){
				for(var j=0;j<global.categorys.length;j++){
					if(a[i]._id.toString()==global.categorys[j]._id.toString()){
						a[i].en_name = global.categorys[j].en_name
					}
				}
			}

			var out = [];
			for(var i=0;i<a.length;i++){
				for(var j=0;j<bigs.items.length;j++){
					if(inBig(a[i],bigs.items[j])){
						var index = inOut(bigs.items[j],out);
						if(index==-1){
							var tmp = {
								en_name:bigs.items[j].en_name,
								name:bigs.items[j].name,
								count:a[i].count
							}
							out.push(tmp);
						}else{
							out[index].count += a[i].count;
						}
					}else{
						console.log('没找到'+a[i].name);
					}
				} 
			}
			res.send({length:out.length,out:out,big:global.bigs})	
		}else{
			res.send('找不到任何结果')
		}
		
	});
};

var inOut = function(a,out){
	var index = -1;
	for(var i=0;i<out.length;i++){
		if(a.en_name==out[i].en_name)
			index = i;
	}
	return index;
};

var inBig = function(a,big){
	for(var i=0;i<big.categorys.length;i++){
		if(a.en_name==big.categorys[i])
			return true;
	}
	return false;
};

exports.importCategoryRestaurantData = function(req,res){
	var items = CategoryR.items;
	var flag = req.query.flag;
	if(flag){
		for(var i=0;i<items.length;i++){
			(function(k){
				var item = items[k];
				Category.newAndSave('1',item.cn_name,item.name,function(){
					console.log(k+' over!');
				});
			})(i);
		}
	}
	else{
		res.end();
	}
};

exports.importCategoryShoppingData = function(req,res){
	var items = CategoryS.items;
	var flag = req.query.flag;
	if(flag){
		for(var i=0;i<items.length;i++){
			(function(k){
				var item = items[k];
				Category.newAndSave('2',item.name,item.en_name,function(){
					console.log(k+' over!');
				});
			})(i);
		}
	}
	else{
		res.end();
	}
};

exports.importLifeData = function(req,res){
	var flag = req.query.flag;
	if(flag){
		var cityItems = getInitData();
		var ep = new EventProxy();
	    ep.bind('error', function (err) {
	        ep.unbind();// 卸载掉所有handler
	        console.log(err);
	        callback(err);// 异常回调

	    });
	    console.log('--------'+cityItems.length);
	    ep.after('getFull', cityItems.length, function (list) {
	        // callback(null,list);
	        // var c = [];
	        // for(var i=0;i<list.length;i++){
	        // 	c = c.concat(list[i]); 
	        // }
	        // writeImgFile(c);
	        res.send(list.length);
	    });
	    for(var i=0;i<cityItems.length;i++){
	        importOne(cityItems[i],ep.group('getFull'));
	    }

	}else{
		console.log('flag is null');
	}
};

function writeImgFile(obj,cityname){
	fs.appendFileSync('c:/images_'+cityname+'.js', JSON.stringify(obj),[], function (err) {
	  if (err) throw err;
	  console.log('The "data to append" was appended to file!');
	});
} 

var importOne = function(one, callback){
	var cityid = one.cityid;
	var cityname = one.cityname;
	var items = one.items;
	var images = [];
	var ep = new EventProxy();
	ep.bind('error', function (err) {
        ep.unbind();// 卸载掉所有handler
        console.log("you wenti !");
        callback(err);// 异常回调
    });

    ep.after('getAll', items.length, function (list) {
    	console.log(items.length);
        callback(null,images);
    });


	for(var i=0;i<items.length;i++){
		(function(k){
			var item = items[k];
			var categorystrlist = item.categorystrlist;
			if(isNotNull(item.ogtitle)){
				var one = new RestaurantModel();
				// var one = new ShoppingModel();
				one.name = item.ogtitle;
				one.city_id = cityid;
				one.city_name = cityname;
				one.ranking = item.ranking;
				if(item.placelocationlongitude && item.placelocationlatitude){
					one.longitude = item.placelocationlongitude;
					one.latitude = item.placelocationlatitude;
				}
				if(isNotNull(item.categorystrlist)){
					one.category = getCategory(item.categorystrlist);
				}

				if(isNotNull(item.ogimage)){
					var fileName = getImageFileName(item.ogimage);
					var image = {
						fileName:fileName,
						image:item.ogimage
					}
					images.push(image);
					one.cover_image = fileName;
					one.image.push(fileName);
					// writeImgFile(image,cityname);
				}

				if(isNotNull(item.ogdescription)){
					one.introduce = item.ogdescription;
				}

				if(isNotNull(item.address)){
					one.address = replaceBR(item.address);
				}

				if(isNotNull(item.postalcode)){
					one.postal_code = item.postalcode;
				}

				if(isNotNull(item.telephone)){
					one.tel = item.telephone;
				}

				if(isNotNull(item.website)){
					one.website = item.website;
				}

				if(isNotNull(item.avgprice)){
					one.price_desc = getPriceDesc(item.avgprice)
				}
				if(isNotNull(item.pricelevel)){
					one.price_level = getPriceLevel(item.pricelevel);
				}
				
				if(isNotNull(item.hours) && item.hours.length!=0){
					one.open_time = getOpenTime(item.hours);
				}

				if(!isEmptyObject(item.businessinfos)){
					one.info = getInfo(item.businessinfos);
				}

				if(isNotNull(item.rating)){
					one.rating = parseFloat(item.rating);
				}

				if(isNotNull(item.reviewcount)){
					one.reviews = parseInt(item.reviewcount);
				}

				if(isNotNull(item.reviewcomment)){
					one.comments.push(item.reviewcomment);
				}

				if(isNotNull(item.ogurl)){
					one.url = item.ogurl;
				}

				one.save(function(err){
					// console.log(restaurant);
					console.log(++count+' over!');
					return ep.emit('getAll');
				});
			}else{
				return ep.emit('getAll');
			}
		})(i);
		
	}
};

function isNotNull(str){
	if(str && str!='null' && str!='undefined')
		return true;
	else
		return false;
}

function isEmptyObject(obj){
	if(obj==null || obj==undefined)
		return true;
	else
		return Object.keys(obj).length?false:true;
}

function getImageFileName(url) {
    var suffix = url.split('.');
    var _id = new ObjectID();
    return  _id + '.' + suffix[suffix.length-1];
}

function getPriceDesc(avgprice){
	avgprice = trim(avgprice);
	if(avgprice=='Pricey')
		return '比较贵';
	else if(avgprice=='Moderate')
		return '一般';
	else if(avgprice=='Inexpensive')
		return '比较便宜';
	else
		return avgprice;
}

function getPriceLevel(pricelevel){
	pricelevel = trim(pricelevel);
	if(pricelevel=='$')
		return 1;
	else if(pricelevel=='$$')
		return 2;
	else if(pricelevel=='$$$')
		return 3;
	else
		return 4;
}


function getOpenTime(open_time){
	var rt = [];
	open_time = delOpenNow(open_time);
	for(var i=0;i<open_time.length;i++){
		var item = open_time[i];
		var x = getWeek(i,item);
		var a = {
			desc : x.desc,
			value: x.value
		};
		rt.push(a);
	}
	return rt;
}

function delOpenNow(open_time){
	var rt = [];
	var staticP = '';
	for(var i=0;i<open_time.length;i++){
		if(open_time[i]!="Open now" && open_time[i]!="Closed"){
			staticP = open_time[i];
			break;
		}
	}
	// console.log(staticP);
	for(var i=0;i<open_time.length;i++){
		var item = open_time[i];
		if(item=='Open now'){
			item = staticP;
		}
		rt.push(item);
	}
	return rt;
}

function getWeek(i,item){
	var desc = '';
	var value = '';
	if(item=='Closed'){
		desc = '关门';
		value = 'close-close';
	}
	else{
		var a = item.split('-');
		if(a.length<2){
			desc = '关门';
			value = 'close-close';
		}
		else{
			desc = a[0] + '-'+a[a.length-1];
			value = getAmPmData(a[0]) + '-' + getAmPmData(a[a.length-1]);
		}	
	}

	if(i==0)
		return {desc:"周一 "+desc,value:'1-'+value}
	else if(i==1)
		return {desc:"周二 "+desc,value:'2-'+value} 
	else if(i==2)
		return {desc:"周三 "+desc,value:'3-'+value} 
	else if(i==3)
		return {desc:"周四 "+desc,value:'4-'+value} 
	else if(i==4)
		return {desc:"周五 "+desc,value:'5-'+value} 
	else if(i==5)
		return {desc:"周六 "+desc,value:'6-'+value} 
	else 
		return {desc:"周日 "+desc,value:'7-'+value} 
}

function getAmPmData(amOrpm){
	amOrpm = trim(amOrpm);
	var a = amOrpm.split(' ');
	if(a[0]){
		var b = a[0].split(':');
		var data = '';
		if(a[1]=='pm'){
			data = parseInt(b[0]) + 12;
		}else{
			data = b[0];
		}
		
		if(b[1]=='30')
			data += '.5';
	}
	return data;
} 

function getInfo(businessinfos){
	var info = {};
	if(businessinfos["Takes Reservations"] && businessinfos["Takes Reservations"]=='Yes'){
		info.yu_ding = true;
	}
	if(businessinfos["Take-out"] && businessinfos["Take-out"]=='Yes'){
		info.take_out = true;
	}

	if(businessinfos["Accepts Credit Cards"] && businessinfos["Accepts Credit Cards"]=='Yes'){
		info.card = true;
	}

	if(businessinfos["Good For"]){
		info.g_for = businessinfos["Good for"];
	}

	if(businessinfos["Good for Kids"] && businessinfos["Good for Kids"]=='Yes'){
		info.g_f_kid = true;
	}

	if(businessinfos["Good for Groups"] && businessinfos["Good for Groups"]=='Yes'){
		info.g_f_group = true;
	}

	if(businessinfos["Noise Level"]){
		info.noise = businessinfos["Noise Level"];
	}

	if(businessinfos["Wi-Fi"] && businessinfos["Wi-Fi"]=='Yes'){
		info.wi_fi = true;
	}

	if(businessinfos["Has TV"] && businessinfos["Has TV"]=='Yes'){
		info.tv = true;
	}

	if(businessinfos["Waiter Service"] && businessinfos["Waiter Service"]=='Yes'){
		info.waiter = true;
	}

	if(businessinfos.Delivery && businessinfos.Delivery=='Yes'){
		info.delivery = true;
	}
	
	if(businessinfos.Alcohol){
		info.alcohol = businessinfos.Alcohol;
	}

	if(businessinfos["Outdoor Seating"] && businessinfos["Outdoor Seating"]=='Yes'){
		info.out_seat = true;
	}

	return info;
}

function getCategory(categorystrlist){
	var a = categorystrlist.split(',');
	var rt = [];
	for(var i=0;i<a.length;i++){
		for(var k=0;k<global.categorys.length;k++){
			var x = global.categorys[k];
			if(trim(a[i])==x.en_name){
				var item = {
					_id:x._id,
					name:x.name
				};
				rt.push(item);
			}
		}
	}
	return rt;
}

// function isRestaurant(categorystrlist){
// 	if(categorystrlist=='' || categorystrlist==null || categorystrlist=='null' || categorystrlist==undefined){
// 		return false;
// 	}
// 	var a = categorystrlist.split(',');
// }

function inArray(a,bArray){
	for(var i=0;i<bArray.length;i++){
		if(a==bArray[i])
			return true;
	}
	return false;
}

function indexArray(a,bArray){
	var index = -1;
	for(var i=0;i<bArray.length;i++){
		if(a._id.toString()==bArray[i]._id.toString())
			index = i;
	}
	return index;
}

function trim(content){  
    // 用正则表达式将前后空格    
    if(content==null || content==undefined)
    	return '';
    else
    	return content.replace(/(^\s+)|(\s+$)/g,"");
}

function replaceN(content){  
    //  },{   },\n{  
    if(content==null || content==undefined)
    	return '';
    else
    	return content.replace(new RegExp('},{',"gm"),'},\n{');
}

function replaceBR(content){
	if(content==null || content==undefined)
    	return '';
    else
    	return content.replace(new RegExp('<br>',"gm"),',');
}
