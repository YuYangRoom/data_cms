var models = require('../models');
var Pgc = models.Pgc;
var City = models.City;
var Attraction = models.Attraction;//0
var Restaurant = models.Restaurant;//1
var Shopping = models.Shopping;//2
var Area = models.Area;//3;
var ObjectID = require('mongodb').ObjectID;
var Util = require('../routes/util');
var async = require('async');
exports.getPgc = function (id, callback) {
    Pgc.findOne({_id: id}, callback);
};
exports.getPgcByEnName = function (title, callback) {
    Pgc.findOne({title: title}, callback);
};

exports.getPgcsByTypeLimit = function (type, skip, pageLimit, callback) {
    Pgc.find({type: type}, [], {sort: [['title', 'desc']], skip: skip, limit: pageLimit}, function (err, pgcs) {
        if (err)
            callback(err);
        else {
            callback(null, pgcs);
        }
    });
};
exports.getPgcsByType = function (type, callback) {
    Pgc.find({type: type}, [], {sort: [['title', 'desc']]}, function (err, pgcs) {
        if (err)
            callback(err);
        else {
            callback(null, pgcs);
        }
    });
};
exports.getPgctagsByType = function (type, key, callback) {
    var query = "";
    if (Util.trim(key) == '') {
        query = {type: type};
    }
    else {
        var name = eval("/" + key + "/");
        query = {type: type, title: name}
    }
    Pgc.find(query, [], {sort: [['title', 'desc']]}, function (err, pgcs) {
        if (err)
            callback(err);
        else {
            callback(null, pgcs);
        }
    });
};
exports.getPgcsByQuery = function (query, callback) {
    Pgc.find(query, [], {sort: [['title', 'desc']]}, function (err, pgcs) {
        if (err)
            callback(err);
        else {
            callback(null, pgcs);
        }
    });
};

exports.count = function (type, callback) {
    Pgc.count({type: type}, callback);
};

exports.getPgc_ByQuery = function(query,callback){
    Pgc.find(query, [], {sort: [['title', 'desc']],limit:10}, function (err, pgcs) {
        if(err)
            callback(err);
        else{
            callback(null,pgcs);
        }
    });
};

exports.updateImage = function (_id, image, callback) {
    exports.getPgc(new ObjectID(_id + ''), function (err, result) {
        if (result) {
            //console.log(one.type+'##'+one.title+'#####'+one.desc+'####'+one.open_time+'#####'+ one.close_time);
            result.cover_image = image;
            result.save(function (err) {
                callback(err, result);
            });
        } else {
            callback(err + 'not found!')
        }
    });
};
exports.updateOriginImage = function (_id, image, callback) {
    exports.getPgc(new ObjectID(_id + ''), function (err, result) {
        if (result) {
            result.original.image = image;
            result.save(function (err) {
                callback(err, result);
            });
        } else {
            callback(err + 'not found!')
        }
    });
};
exports.update = function (one, callback) {
    exports.getPgc(new ObjectID(one._id + ''), function (err, result) {
        if (result) {
                var p_poi = one.pgc_poi;
             async.map(p_poi, function (item, callback) {
                        var query1 = item._id;
                        var type = item.type;
                        switch (type) {
                            case '0':
                                Attraction.findOne({_id: query1}, function (err, data) {
                                    if (data) {
                                        item.name = data.attractions;
                                        if(data.image[0]){
                                            item.poi_image=data.image[0];
                                            //console.log(data.image[0]);
                                        }

                                        callback(null, item);
                                    } else {
                                        console.log('查询失败！');
                                        callback(null, null);
                                    }
                                });
                                break;
                            case '1':
                                Restaurant.findOne({_id: query1}, function (err, data) {
                                    if (data) {
                                        item.name = data.name;
                                        if(data.image[0]){
                                            item.poi_image=data.image[0];
                                            //console.log(data.image[0]);
                                        }
                                        callback(null, item);
                                    } else {
                                        console.log('查询失败！');
                                        callback(null, null);
                                    }
                                });
                                break;
                            case '2':
                                Shopping.findOne({_id: query1}, function (err, data) {
                                    if (data) {
                                        item.name = data.name;
                                        if(data.image[0]){
                                            item.poi_image=data.image[0];
                                            //console.log(data.image[0]);
                                        }
                                        callback(null, item);
                                    } else {
                                        console.log('查询失败！');
                                        callback(null, null);
                                    }
                                });
                                break;
                            case '3':
                                Area.findOne({_id: query1}, function (err, data) {
                                    if (data) {
                                        item.name = data.area_name;
                                        if(data.image[0]){
                                            item.poi_image=data.image[0];
                                            //console.log(data.image[0]);
                                        }
                                        callback(null, item);
                                    } else {
                                        console.log('查询失败！');
                                        callback(null, null);
                                    }
                                });
                                break;
                            case '':
                                item.poi_image='';
                                callback(null, item);
                                break;
                            default :
                                console.log('poi与类型匹配失败！');
                                callback(null, null);
                                break;
                        }
                    }, function (err, res2) {
                        var p_poi_2 = [];
                        for (var i = 0; i < res2.length; i++) {
                            if (res2[i]) {
                                p_poi_2.push(res2[i]);
                                //console.log(res2[i]);
                            }

                        }
                        //	res2=res2.toObject();
                        result.type = one.type;
                        //result.index_type ='1';
                        result.pgc_title = one.pgc_title;
                        result.title = one.title;
                        result.content = one.content;
                        //result.pgc_city = one.pgc_city;
                        result.pgc_city = one.pgc_city;
                        result.original = one.original;
                        result.pgc_tags = one.pgc_tags;
                        result.introducation = one.introducation;
                        result.pgc_people = one.pgc_people;
                        result.pgc_country = one.pgc_country;
                        //result.pgc_poi = one.pgc_poi;
                        result.pgc_poi = p_poi_2;
                        result.c_start_time = one.c_start_time;
                        result.start_time = one.start_time;
                        result.c_end_time = one.c_end_time;
                        result.end_time = one.end_time;
                        //var a=result.toObject();
                        result.save(function (err) {
                            callback(err, result);
                        });
                    }
                );

        } else {
            callback(err + 'not found!')
        }
    });
};
//pgc.pgc_title,pgc.content,pgc.introducation,pgc.pgc_tags,
exports.newAndSave = function (type, title, pgc_city,original, pgc_people, pgc_title, content, introducation, pgc_tags, pgc_country, pgc_poi, c_start_time, start_time, c_end_time, end_time, callback) {
    var pgc = new Pgc();

    var p_poi =pgc_poi;
    async.map(p_poi, function (item, callback) {
            var query1 = item._id;
            var type = item.type;
            switch (type) {
                case '0':
                    Attraction.findOne({_id: query1}, function (err, data) {
                        if (data) {
                            item.name = data.attractions;
                            if(data.image[0]){
                                item.poi_image=data.image[0];
                                //console.log(data.image[0]);
                            }
                            callback(null, item);
                        } else {
                            console.log('查询失败！');
                            callback(null, null);
                        }
                    });
                    break;
                case '1':
                    Restaurant.findOne({_id: query1}, function (err, data) {
                        if (data) {
                            item.name = data.name;
                            if(data.image[0]){
                                item.poi_image=data.image[0];
                                //console.log(data.image[0]);
                            }
                            callback(null, item);
                        } else {
                            console.log('查询失败！');
                            callback(null, null);
                        }
                    });
                    break;
                case '2':
                    Shopping.findOne({_id: query1}, function (err, data) {
                        if (data) {
                            item.name = data.name;
                            if(data.image[0]){
                                item.poi_image=data.image[0];
                                //console.log(data.image[0]);
                            }
                            callback(null, item);
                        } else {
                            console.log('查询失败！');
                            callback(null, null);
                        }
                    });
                    break;
                case '3':
                    Area.findOne({_id: query1}, function (err, data) {
                        if (data) {
                            item.name = data.area_name;
                            if(data.image[0]){
                                item.poi_image=data.image[0];
                                //console.log(data.image[0]);
                            }
                            callback(null, item);
                        } else {
                            console.log('查询失败！');
                            callback(null, null);
                        }
                    });
                    break;
                case '':
                    item.poi_image='';
                    callback(null, item);
                    break;
                default :
                    console.log('poi与类型匹配失败！');
                    callback(null, null);
                    break;
            }
        }, function (err, res2) {
            var p_poi_2 = [];
            for (var i = 0; i < res2.length; i++) {
                if (res2[i]) {
                    p_poi_2.push(res2[i]);
                    //console.log(res2[i]);
                }

            }
              pgc.type = type;
            pgc.title = title;
            pgc.pgc_city = pgc_city;
            pgc.original = original;
            pgc.pgc_people = pgc_people;
            pgc.pgc_title = pgc_title;
            pgc.content = content;
            pgc.introducation = introducation;
            pgc.pgc_tags = pgc_tags;
            pgc.pgc_country = pgc_country;
            pgc.pgc_poi = p_poi_2;
            pgc.c_start_time = c_start_time;
            pgc.start_time = start_time;
            pgc.c_end_time = c_end_time;
            pgc.end_time = end_time;
            pgc.save(function (err) {
                callback(err, pgc);
            });
        }
    );

};
