/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */
require('../config/Config');
var CityProvider = require("../config/CityProvider").CityProvider;
var cityProvider = new CityProvider();
var ObjectID = require('mongodb').ObjectID;
var LabelProvider = require("../config/LabelProvider").LabelProvider;
var labelProvider = new LabelProvider();
fs = require('fs');

exports.getAllCity = function (req, res) {

    cityProvider.find({}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};

exports.getCityByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex-1);
    cityProvider.count({},function(err,count){
        cityProvider.find({}, {sort:{'hot_flag':-1},skip:skip, limit:req.params.pageLimit}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({city:result,count:count});
            }
        });
    });

};

function getSubLabel(label,sblabel,callback){
    var _id = label;
    labelProvider.findOne({'_id':new ObjectID(_id)},{'label':1},function(err,re){
        if(err){
        }else{
            if(re){
                sblabel.push({'label':re.label,'_id':re._id});
                callback(sblabel);
            }else{
                callback(sblabel);
            }
        }

    });
}
function startTask(paramsArray,sblabel,current,count,callBack){
    if(current>=count){
            callBack(sblabel);
    }else{
        getSubLabel(paramsArray[current],sblabel,function(sblabel){
            startTask(paramsArray,sblabel,current+1,count,callBack);
        });
    }
}
exports.getCity = function (req, res) {
    if (req.params.cityID) {
        cityProvider.findOne({_id:new ObjectID(req.params.cityID)}, {}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                if(result.masterLabel){
                    labelProvider.findOne({_id:new ObjectID(result.masterLabel)},{},function(err,data){
                        if(err){
                            res.end();
                        }else{
                            if(data){
                                result.masterLabel = {'masterLabel':data.label,'_id':data._id};
                                var sblabel = [];
                                if(result.subLabel&&result.subLabel.length){
                                    startTask(result.subLabel,sblabel,0,result.subLabel.length,function(sblabel){
                                        result.subLabel = sblabel;
                                        res.send(result);
                                    });
                                }else{
                                    res.send(result);
                                }
                            }else{
                                res.send(result);
                            }
                        }
                    });
                }else{
                    var sblabel = [];
                    result.masterLabel = {'masterLabel':'','_id':''};
                    if(result.subLabel&&result.subLabel.length){
                        startTask(result.subLabel,sblabel,0,result.subLabel.length,function(sblabel){
                            result.subLabel = sblabel;
                            res.send(result);
                        });
                    }else{
                        res.send(result);
                    }
                }
            }
        });
    }
};

exports.saveCity = function (req, res) {
    var data = req.body;
    console.log(data);
    if(data.label&&data.label.length>0){
        var sub = [];
        for(var i=0;i<data.label.length;i++){
            sub.push(data.label[i]);
        }
    }

    data.subLabel = sub;
    cityProvider.insert(data, {safe:true}, function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result[0]._id});
        }
    });
};
exports.updateCity = function (req, res) {
    var data = req.body;
    if(data.label.length>0){
        var sub = [];
        for(var i=0;i<data.label.length;i++){
            sub.push(data.label[i]);
        }
    }
    data.subLabel = sub;
    var setJson = {cityname:req.body.cityname,cityname_en:req.body.cityname_en,countryname:req.body.countryname, recommand_day:req.body.recommand_day,introduce:req.body.introduce,short_introduce:req.body.short_introduce,hot_flag:req.body.hot_flag,city_rank:req.body.city_rank,show_flag:req.body.show_flag,subLabel:data.subLabel,latitude:req.body.latitude,longitude:req.body.longitude };
    cityProvider.update({_id:new ObjectID(req.params.cityID)}, {$set:setJson}, {safe:true}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};

exports.deleteCity = function (req, res) {

    cityProvider.remove({_id:new ObjectID(req.params.cityID)}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({_id:req.params.attractionsID});
        }
    });
};


exports.upload = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var imageName = imageID+ '.' + fileExtention;
    var filePath = global.imgpath + imageName;
    var fileStream = fs.createWriteStream(filePath);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'coverImageId':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'image':imageName},$set:{'coverImageName':imageName,"imgFlag":true}}, {safe:true}, function (err, result) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{ 'image':imageName}}, {safe:true}, function (err, result) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });

    });
};

 //上处前台页面城市背景大图
exports.upload_background_img = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'img_background_Flag':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_background':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}},$set:{"img_background_Flag":true}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_background':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });

    });
};

// 上传前台页面左边大图
exports.upload_left_img = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'img_left_Flag':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_left':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}},$set:{"img_left_Flag":true}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_left':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });
    });
};

// 上传前台页面小图
exports.upload_small_img = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'img_small_Flag':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_small':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}},$set:{"img_small_Flag":true}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_small':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });
    });
};

// 上传前台页面右边中图
exports.upload_right_middle_img = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'img_right_middle_Flag':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_right_middle':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}},$set:{"img_right_middle_Flag":true}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_right_middle':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });
    });
};
// 上传前台页面左边中图
exports.upload_left_middle_img = function (req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function () {

        cityProvider.findOne({_id:new ObjectID(city_id), 'img_left_middle_Flag':null}, {}, function (err, result) {
            if (err) {
            } else {
                if (result) {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_left_middle':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}},$set:{"img_left_middle_Flag":true}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });

                } else {
                    cityProvider.update({_id:new ObjectID(city_id)}, {$push:{'img_left_middle':{'imageID':imageID,'imageExtention':fileExtention,'imagename':imageID+'.'+fileExtention}}}, {safe:true}, function (err) {
                        if (err) {
                            res.send({success:false});
                        } else {
                            res.send({success:true});
                        }
                    });
                }
            }
        });
    });
};






