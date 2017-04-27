/**
 * User: katat
 * Date: 9/8/13
 * Time: 10:17 AM
 */
require('../config/Config');
var fs = require('fs');
var HotelProvider = require('../config/HotelProvider').HotelProvider;
var ObjectID = require('mongodb').ObjectID;
var hotelProvider = new HotelProvider();
var im = require('imagemagick');
im.identify.path = global.imIdentifyPath;
im.convert.path = global.imConvertPath;
var upyunClient = require('./upyun/upyunClient');
var Util = require('./util');

exports.addNewHotel = function(req, res){
    var hotelDetails = req.body;
    hotelProvider.insert(hotelDetails, {safe:true}, function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result[0]._id});
        }
    });
};

exports.update = function(req, res){
    var json = req.body;
    delete json._id;
    hotelProvider.update({_id:new ObjectID(req.params.hotelId)}, {$set:json}, {safe:true}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};

exports.get = function(req, res){

    hotelProvider.findOne({_id:new ObjectID(req.params.hotelId)}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};

exports.getHotelByPage = function (req, res) {
    var cityname = req.query.cityname;
    var hotelname = req.query.hotelname;
    var query = {};
    if(!Util.isNull(cityname))
        query.city = cityname;
    if(!Util.isNull(hotelname))
        query.name = {$regex:hotelname};
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    hotelProvider.count(query, function (err, count) {
        hotelProvider.find(query, {sort:{_id:1} , skip:skip, limit:req.params.pageLimit}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({hotels:result, count:count});
            }
        });
    });
};

exports.remove = function(req, res){
    console.log(new ObjectID(req.params.hotelId));
    hotelProvider.remove({_id:new ObjectID(req.params.hotelId)}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({_id:req.params.hotelId});
        }
    });
};

exports.getImage = function(req, res){
    var imageID = req.params.fileName;
    if (imageID != 'undefined') {
        var path = global.imgpathDO + imageID;
        fs.exists(path, function (exists) {
            if (exists) {
                fs.readFile(path, "binary", function (err, data) {
                    if (err) {
                        res.end();
                        throw err;
                    } else {
                        if (data) {
                            res.write(data, "binary");
                            res.end();
                        } else {
                            res.end();
                        }
                    }
                });
            } else {
                res.end();
            }
        });
    } else {
        res.end();
    }
};

exports.uploadImage = function(req, res){
    var target_upload_name;
    if (req.files.length != 0 && req.body._id){
        var tmp_upload = req.files.files[0];
        // console.log(req.files.files[0]);
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathDO + target_upload_name;
        var filePathD1 = global.imgpathD1 + target_upload_name;
        var filePathD2 = global.imgpathD2 + target_upload_name;
        var filePathD3 = global.imgpathD3 + target_upload_name;
        var filePathD4 = global.imgpathD4 + target_upload_name;
        
        makeImageFile(tmp_upload_path, target_upload_path,filePathD1,filePathD2,filePathD3,filePathD4, function (){
           upyunClient.upHotelToYun(target_upload_name,function(err,data){
                if(err)
                    console.log(err);
                else{
                    hotelProvider.update({_id:new ObjectID(req.body._id)}, {$push:{ 'images':target_upload_name}}, {safe:true}, function (err) {
                        if (err) {
                            throw err;
                        } else {
                             res.setHeader("Content-Type", "application/json");
                            var hotelModel = hotelProvider.findOne({_id:new ObjectID(req.body._id)}, {}, function(err, result){
                                res.json(result.images);
                                res.end();
                            });
                        }
                    });
                }
            });
        });
    } else {
        res.end();
    }
};

exports.delUploadImageHotel = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    
    fs.unlink(global.imgpathDO + imageName, function () {
        fs.unlink(global.imgpathD1 + imageName, function () {
            fs.unlink(global.imgpathD2 + imageName, function () {
                fs.unlink(global.imgpathD3 + imageName, function () {
                    fs.unlink(global.imgpathD4 + imageName, function () {
                        hotelProvider.update({_id:new ObjectID(_id)}, {$pull:{ 'images':imageName}}, {safe:true}, function (err) {
                            if (err) throw err;
                            upyunClient.delHotelFromYun(imageName,function(err,data){
                                if(err) res.send({'status':'fail'});
                                res.send({'status':'success'});
                            });
                        });
                    });
                });
            });
        });
    });

};

function validPic(type) {
    var suffix = type.split('/')[1];
    var _id = new ObjectID();
    return  _id + '.' + suffix;
}

function makeImageFile(tmp_path, target_path,target_path_D1, target_path_D2,target_path_D3, target_path_D4, callback) {
    fs.rename(tmp_path, target_path, function (err) {
        if (err) {
            throw err;
        }

        fs.unlink(tmp_path, function () {
            if (err) throw err;
            im.crop({srcPath:target_path,dstPath:target_path_D1,width:global.imgsizeD1.width,height:global.imgsizeD1.height,quality:1,gravity:'Center'}, function (err, metadata) {
                if (err) throw err;
                im.crop({srcPath:target_path,dstPath:target_path_D2,width:global.imgsizeD2.width,height:global.imgsizeD2.height,quality:1,gravity:'Center'}, function (err, metadata) {
                    if (err) throw err;
                    im.crop({srcPath:target_path,dstPath:target_path_D3,width:global.imgsizeD3.width,height:global.imgsizeD3.height,quality:1,gravity:'Center'}, function (err, metadata) {
                        if (err) throw err;
                        im.crop({srcPath:target_path,dstPath:target_path_D4,width:global.imgsizeD4.width,height:global.imgsizeD4.height,quality:1,gravity:'Center'}, function (err, metadata) {
                            if (err) throw err;
                            process.nextTick(callback);
                        });
                    });
                });
            });
        });
    });
}
