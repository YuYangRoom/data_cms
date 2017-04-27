/*
* google抓取数据
*
* */
var request = require('request');
var models= require('../models');
var logger4js = require('../utils/log').logger;
exports.googlePlaceSpider=function(data,callback){

    var googleUrl= myurl = "http://"+"203.88.174.39:8080"+"/newgo/spider/googlePlace?id="+data;
    console.log('googleID：'+data+'\n请求url：'+googleUrl);
    //console.log(googleUrl);
    request.get(googleUrl,null,function(err,response,body){

        if(err){
            console.log("error");
            callback(null,null);
        }else{
            console.log(body);
            callback(null,body);
        }
    });

}