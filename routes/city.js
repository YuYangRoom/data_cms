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
var EditUserProvider = require("../config/EditUserProvider").EditUserProvider;
var editUserProvider = new EditUserProvider();
var AttractionsProvider = require("../config/AttractionsProvider").AttractionsProvider;
var attractionsProvider = new AttractionsProvider();
fs = require('fs');
var im = require('imagemagick');
im.identify.path = global.imIdentifyPath;
im.convert.path = global.imConvertPath;
var upyunClient = require('./upyun/upyunClient');
var Country = require('./country');
var EventProxy = require('eventproxy');
var Attraction = require('./attractions');
var Auditing = require('../proxy').Auditing;
var Attractions = require('../proxy').Attractions;
var EditUser = require('./editUser');
var EditUserProxy = require('../proxy').EditUser;
var Restaurant = require('../proxy').Restaurant;
var Area = require('../proxy').Area;
var City = require('../proxy').City;
var Label = require('../proxy').Label;
var Shopping = require('../proxy').Shopping;
var Util = require('./util');
var async = require('async');

exports.getAllCity = function(req, res) {
    cityProvider.find({}, {}, function(err, result) {
        if (err) {
            res.send({
                err: err
            });
        } else {
            res.send(result);
        }
    });
};
exports.getCountryCities = function(req, res) {
    var countryname = req.params.countryname;
    var query = {};
    if (req.query.cityname) query.cityname = req.query.cityname;
    if (req.query.status) query.status = req.query.status;
    query.countryname = req.params.countryname;
    var sortlist = {};
    if (req.query.sort) {
        var sortname = req.query.sort;
        var sortdir = req.query.sortdir;
        if (sortname == 'show_flag') {
            if (sortdir == 'desc') {
                sortlist.show_flag = -1;
            } else {
                sortlist.show_flag = 1;
            }
        }
        if (sortname == 'hot_flag') {
            if (sortdir == 'desc') {
                sortlist.hot_flag = -1;
            } else {
                sortlist.hot_flag = 1;
            }
        }
        if (sortname == 'status') {
            if (sortdir == 'desc') {
                sortlist.status = -1;
            } else {
                sortlist.status = 1;
            }
        }

    }
    async.auto({
        city: function(cb) {
            console.log(query);
            cityProvider.find(query, {
                sort: sortlist
            }, cb);
        }
    }, function(err, result) {
        if (err) {
            res.render('404', err);
        } else {
            res.send({
                status: true,
                results: result
            });
        }
    })
};

exports.getAllCityBaseInfo = function(req, res) {
    cityProvider.find({}, {
        cityname: 1
    }, function(err, result) {
        if (err) {
            res.send({
                status: false,
                err: err
            });
        } else {
            res.send({
                status: true,
                results: result
            });
        }
    });
};

exports.getCityByPage = function(req, res) {
    var country = req.query.country;
    var cityname = req.query.cityname;
    var query = {};
    if (!Util.isNull(country))
        query.countryname = country;
    if (!Util.isNull(cityname))
        query.cityname = cityname;
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    cityProvider.count(query, function(err, count) {
        cityProvider.find(query, {
            sort: {
                'show_flag': -1,
                'hot_flag': -1
            },
            skip: skip,
            limit: req.params.pageLimit
        }, function(err, result) {
            if (err) {
                res.send({
                    err: err
                });
            } else {
                res.send({
                    city: result,
                    count: count
                });
            }
        });
    });

};

function getSubLabel(label, sblabel, callback) {
    var _id = label;
    labelProvider.findOne({
        '_id': new ObjectID(_id)
    }, {
        'label': 1
    }, function(err, re) {
        if (err) {} else {
            if (re) {
                sblabel.push({
                    'label': re.label,
                    '_id': re._id
                });
                callback(sblabel);
            } else {
                callback(sblabel);
            }
        }

    });
}

function startTask(paramsArray, sblabel, current, count, callBack) {
    if (current >= count) {
        callBack(sblabel);
    } else {
        getSubLabel(paramsArray[current], sblabel, function(sblabel) {
            startTask(paramsArray, sblabel, current + 1, count, callBack);
        });
    }
}

exports.getCityByName = function(req, res) {
    var cityid = req.params.cityid;
    var currentuser = req.session.user.username;
    async.auto({
        city: function(cb) {
            City.findCity({
                _id: cityid
            }, cb);
        },
        // masterLabel: ['city',function(cb,result){
        //     if(result.city.masterLabel){
        //         Label.findOneById(result.city.masterLabel,cb);
        //     }
        // }],
        attractionscount: function(cb) {
            attractionsProvider.count({
                cityid: cityid
            }, cb);
        },
        restaurantscount: function(cb) {
            Restaurant.countRestaurant({
                cityid: cityid
            }, cb);
        },
        shopareacount: function(cb) {
            Area.count({
                city_id: cityid
            }, cb);
        },
        shoppingscount: function(cb) {
            Shopping.count({
                city_id: cityid
            }, cb);
        },
        audits: function(cb) {
            Auditing.findAuditingByQuery({
                item_id: cityid
            }, cb);
        },
        edituser: function(cb) {
            
            EditUserProxy.getEditors({
                group: 0
            }, cb);
        },
        eneditoruser: function(cb) {
           
            EditUserProxy.getEditors({
                group: 1
            }, cb);
        }
    }, function(err, result) {
        if (err) {
            console.log(err);
            res.render('404', err);
        } else {
            if (result.audits == null) {
                result.audits = {
                    status: 0
                }
            }
            result.currentuser = currentuser;
            res.send({
                status: true,
                results: result
            });
        }
    });
}

exports.getCityItem = function(req, res) {
    var cityname = req.params.cityname,
        type = req.params.type;
    var name = req.query.name;
    var perpage = req.query.perpage;
    var page = req.query.page;
    var status = req.query.status;
    var query = {};

    if (type == 'attractions') {
        if (cityname) query.cityname = cityname;
        if (name) query.attractions = name;
        if (status) query.status = status;
        // var sortlist = {};
        // if (req.query.sort) {
        //     var sortname = req.query.sort;
        //     var sortdir = req.query.sortdir;
        //     if (sortname == 'show_flag') {
        //         if (sortdir == 'desc') {
        //             sortlist.show_flag = -1;
        //         } else {
        //             sortlist.show_flag = 1;
        //         }
        //     }
        //     if (sortname == 'hot_flag') {
        //         if (sortdir == 'desc') {
        //             sortlist.hot_flag = -1;
        //         } else {
        //             sortlist.hot_flag = 1;
        //         }
        //     }
        //     if (sortname == 'status') {
        //         if (sortdir == 'desc') {
        //             sortlist.status = -1;
        //         } else {
        //             sortlist.status = 1;
        //         }
        //     }
        //     console.log(sortlist);

        // }
        // if (sort && sort == 'show_flag') {
        //     if (sortdir == 'asc') {
        //         sortlist.show_flag = 1;
        //     } else {
        //         sortlist.show_flag = -1;
        //     }
        // }
        // if (sort && sort == 'recommend_flag') {
        //     if (sortdir == 'asc') {
        //         sortlist.recommend_flag = 1;
        //     } else {
        //         sortlist.recommend_flag = -1;
        //     }
        // }
        // if (sort && sort == 'status') {
        //     if (sortdir == 'asc') {
        //         sortlist.status = 1;
        //     } else {
        //         sortlist.status = -1;
        //     }
        // }
        Attractions.findAttractions(query, function(err, attractions) {
            if (err) {
                res.send({
                    err: err
                });
            } else {
                res.send(attractions);
            }
        })
    } else if (type == 'restaurants') {
        if (cityname) query.city_name = cityname;
        if (name) query.name = name;
        if (status) query.status = status;
        console.log(query);
        var skipnum = page * perpage;
        //查找单个的
        if (name) {
            Restaurant.getRestaurantByName({
                name: name
            }, function(err, result) {
                if (err) {
                    res.send({
                        err: err
                    });
                } else {
                    var restaurant = [];
                    restaurant.push(result);
                    res.send({
                        restaurants: restaurant
                    });
                }
            })
        } else {
            async.auto({
                countrestaurants: function(cb) {
                    Restaurant.countRestaurant(query, cb);
                },
                restaurants: function(cb) {
                    Restaurant.findRestaurants({
                        city_name: cityname
                    }, {
                        skip: skipnum,
                        limit: perpage
                    }, cb)
                }
            }, function(err, result) {
                if (status) {
                    async.filter(result.restaurants, function(item, cb) {
                        console.log(item);
                        cb(item.status == status);
                    }, function(result) {
                        var results = {};
                        results.countrestaurants = result.countrestaurants;
                        results.restaurants = result;
                        res.send(results);
                    })
                } else {
                    res.send(result);
                }
            })
        }
    } else if (type == 'shopareas') {
        if (cityname) query.city_name = cityname;
        if (status) query.status = status;
        Area.getAreasByQuery(query, function(err, shopareas) {
            if (err) {
                res.send({
                    err: err
                });
            } else {
                res.send(shopareas);
            }
        })
    } else if (type == 'shoppings') {
        if (cityname) query.city_name = cityname;
        if (name) query.name = name;
        if (status) query.status = status;
        Shopping.findShoppings(query, function(err, shoppings) {
            if (err) {
                res.send({
                    err: err
                });
            } else {
                res.send(shoppings);
            }
        })
    }
}

exports.showCityItem = function(req, res) {
    var type = req.params.type;
    var itemname = req.params.itemname;
    var currentuser = req.session.user.username;
    if (type == "attractions") {
        async.auto({
            cityitem: function(cb) {
                Attractions.findOneByName({
                    attractions: itemname
                }, cb);
            },
            edituser: function(cb) {
                editUserProvider.find({
                    type: 0
                }, {
                    sort: {
                        'username': -1
                    }
                }, cb);
            },
            audits: function(cb) {
                Auditing.findAuditingByQuery({
                    name: itemname
                }, cb)
            }
        }, function(err, result) {
            if (result.audits == null) {
                result.audits = {};
                result.audits.status = 0;
            }
            result.currentuser = currentuser;
            res.send(result);
        })
    }
    if (type == "restaurants") {
        async.auto({
            cityitem: function(cb) {
                Restaurant.getRestaurantByName({
                    name: itemname
                }, cb);
            },
            edituser: function(cb) {
                editUserProvider.find({
                    type: 0
                }, {
                    sort: {
                        'username': -1
                    }
                }, cb);
            },
            audits: function(cb) {
                Auditing.findAuditingByQuery({
                    name: itemname
                }, cb)
            }
        }, function(err, result) {
            if (result.audits == null) {
                result.audits = {};
                result.audits.status = 0;
            }
            result.currentuser = currentuser;
            res.send(result);
        })
    }
    if (type == "shopareas") {
        async.auto({
            cityitem: function(cb) {
                Area.getAreasByName({
                    area_name: itemname
                }, cb);
            },
            edituser: function(cb) {
                editUserProvider.find({
                    type: 0
                }, {
                    sort: {
                        'username': -1
                    }
                }, cb);
            },
            audits: function(cb) {
                Auditing.findAuditingByQuery({
                    name: itemname
                }, cb)
            }
        }, function(err, result) {
            if (result.audits == null) {
                result.audits = {};
                result.audits.status = 0;
            }
            result.currentuser = currentuser;
            res.send(result);
        })
    }
    if (type == "shoppings") {
        async.auto({
            cityitem: function(cb) {
                Shopping.findShopByName({
                    name: itemname
                }, cb);
            },
            edituser: function(cb) {
                editUserProvider.find({
                    type: 0
                }, {
                    sort: {
                        'username': -1
                    }
                }, cb);
            },
            audits: function(cb) {
                Auditing.findAuditingByQuery({
                    name: itemname
                }, cb)
            }
        }, function(err, result) {
            if (result.audits == null) {
                result.audits = {};
                result.audits.status = 0;
            }
            result.currentuser = currentuser;
            res.send(result);
        })
    }
}

exports.getCity = function(req, res) {
    if (req.params.cityID) {
        cityProvider.findOne({
            _id: new ObjectID(req.params.cityID)
        }, {}, function(err, result) {
            if (err) {
                res.send({
                    err: err
                });
            } else {
                if (result.masterLabel) {
                    labelProvider.findOne({
                        _id: new ObjectID(result.masterLabel)
                    }, {}, function(err, data) {
                        if (err) {
                            res.end();
                        } else {
                            if (data) {
                                result.masterLabel = {
                                    'masterLabel': data.label,
                                    '_id': data._id
                                };
                                var sblabel = [];
                                if (result.subLabel && result.subLabel.length) {
                                    startTask(result.subLabel, sblabel, 0, result.subLabel.length, function(sblabel) {
                                        result.subLabel = sblabel;
                                        res.send(result);
                                    });
                                } else {
                                    res.send(result);
                                }
                            } else {
                                res.send(result);
                            }
                        }
                    });
                } else {
                    var sblabel = [];
                    result.masterLabel = {
                        'masterLabel': '',
                        '_id': ''
                    };
                    if (result.subLabel && result.subLabel.length) {
                        startTask(result.subLabel, sblabel, 0, result.subLabel.length, function(sblabel) {
                            result.subLabel = sblabel;
                            res.send(result);
                        });
                    } else {
                        res.send(result);
                    }
                }
            }
        });
    }
};

exports.saveCity = function(req, res) {
    var data = req.body;
    //data.timezone={};
    if (data.label && data.label.length > 0) {
        var sub = [];
        for (var i = 0; i < data.label.length; i++) {
            sub.push(data.label[i]);
        }
    }

    data.subLabel = sub;
    data.random = Math.random();
    console.log(data);
    cityProvider.insert(data, {
        safe: true
    }, function(err, result) {
        if (err) {
            res.send({
                isSuccess: false,
                info: err
            });
        } else {
            res.send({
                isSuccess: true,
                _id: result[0]._id
            });
        }
    });
};
exports.updateCity = function(req, res) {
    var data = req.body;
    var attrs1=[];
    var sub = [];
    if (data.label.length > 0) {
        for (var i = 0; i < data.label.length; i++) {
            if(data.label[i]!=null){
                sub.push(data.label[i]);
                attrs1.push({"_id":data.label[i]});
            }
        }
    }
    data.subLabel = sub;
  /*   if(data.masterLabel.length>0){
        attrs1.push({"_id":data.masterLabel});
    }*/
/*    if(data.masterLabel.length!=null||data.masterLabel.length!=''){

    }*/
    data.attrs2=attrs1;
    //if(data.attrs2.length>0){
        var setJson = {
            continents: data.continents,
            continentscode: data.continentscode,
            cityname: data.cityname,
            cityname_en: data.cityname_en,
            cityname_py: data.cityname_py,
            countryname: data.countryname,
            countrycode: data.countrycode,
            recommand_day: data.recommand_day,
            recommand_indensity: data.recommand_indensity,
            recommand_center: data.recommand_center,
            introduce: data.introduce,
            short_introduce: data.short_introduce,
            restaurant_overview: data.restaurant_overview,
            shopping_overview: data.shopping_overview,
            attraction_overview: data.attraction_overview,
            timezone:data.timezone,
            en_info:data.en_info,
            tips: data.tips,
            traffic: data.traffic,
            hot_flag: data.hot_flag,
            city_rank: data.city_rank,
            show_flag: data.show_flag,
            masterLabel: data.masterLabel,
            shoplabels: data.shoplabels,
            activity_labels: data.activity_labels,
            labels: data.labels,
            reslabels: data.reslabels,
            attrlabels: data.attrs2,
            subLabel: data.subLabel,
            latitude: data.latitude,
            longitude: data.longitude,
            weoid: data.weoid,
            attractionscount: data.attractionscount,
            restaurantscount: data.restaurantscount,
            shopareacount: data.shopareacount,
            shoppingscount: data.shoppingscount,
            editorname: data.editorname,
            editdate: data.editdate,
            auditname: data.auditname,
            auditdate: data.auditdate
        };

    cityProvider.update({
        _id: new ObjectID(req.params.cityID)
    }, {
        $set: setJson
    }, {
        safe: true
    }, function(err, result) {
        if (err) {
            res.send({
                err: err
            });
        } else {
            res.send({
                isSuccess: true
            });
        }
    });
};

exports.updateCityNew = function(req, res) {
    var one = JSON.parse(req.body.model);
    // console.log(one);
    City.updatemsg(one, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send({
                status: 'success'
            });
            res.end();
        }
    })
}

exports.updateAttrItem = function(req, res) {
    var one = JSON.parse(req.body.model);
    Attractions.updatemsg(one, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            res.send({
                status: 'success'
            });
            res.end();
        }
    })
}

exports.updateResShopItem = function(req, res) {
    var one = JSON.parse(req.body.model);

    var type = one.type;
    console.log(typeof one.index_flag);
    if (type == '1') {
        Restaurant.updatemsg(one, function(err, result) {
            if (err) {
                console.log(err)
            } else {
                res.send({
                    status: 'success'
                });
                res.end();
            }
        })
    }
    if (type == '2') {
        Shopping.updatemsg(one, function(err, result) {
            if (err) {
                console.log(err)
            } else {
                res.send({
                    status: 'success'
                });
                res.end();
            }
        })
    }

}

exports.updateAreaItem = function(req, res) {
    var one = JSON.parse(req.body.model);
    Area.updatemsg(one, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            res.end();
        }
    })
}
exports.deleteCity = function(req, res) {
    cityProvider.remove({
        _id: new ObjectID(req.params.cityID)
    }, {}, function(err, result) {
        if (err) {
            res.send({
                err: err
            });
        } else {
            res.send({
                _id: req.params.attractionsID
            });
        }
    });
};

function copyCoverImage(globalpath, strpath, despath, callback) {
    var fileReadStream = fs.createReadStream(globalpath + strpath);
    var fileWriteStream = fs.createWriteStream(globalpath + despath);
    fileReadStream.pipe(fileWriteStream);
    fileWriteStream.on('close', function() {
        callback();
    });
}
exports.setCityCoverImg = function(req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    cityProvider.update({
        _id: new ObjectID(_id)
    }, {
        $set: {
            'coverImageName': imageName,
            "imgFlag": true
        }
    }, {
        safe: true
    }, function(err) {
        if (err) {
            throw err;
        } else {
            res.setHeader("Content-Type", "application/json");
            res.json(imageName);
            res.end();
        }
    });
    // cityProvider.findOne({_id:new ObjectID(_id), 'coverImageName':{$exists:true}}, {}, function (err, result) {
    //     if (err) {
    //         throw err;
    //     } else {
    //         if (result) {
    //             copyCoverImage(global.imgpathCO, imageName, result.coverImageName, function () {
    //                     copyCoverImage(global.imgpathC2, imageName, result.coverImageName, function () {
    //                         copyCoverImage(global.imgpathC3, imageName, result.coverImageName, function () {
    //                             res.setHeader("Content-Type", "application/json");
    //                             res.json(result.coverImageId);
    //                             res.end();
    //                         });
    //                     });
    //             });
    //         } else {
    //             var suffix = imageName.split(".")[1];
    //             var cover_id = new ObjectID();
    //             var cover_name = cover_id + '.' + suffix;
    //             copyCoverImage(global.imgpathCO, imageName, cover_name, function () {
    //                     copyCoverImage(global.imgpathC2, imageName, cover_name, function () {
    //                         copyCoverImage(global.imgpathC3, imageName, cover_name, function () {
    //                             cityProvider.update({_id:new ObjectID(_id)}, {$set:{'coverImageName':cover_name, "imgFlag":true}}, {safe:true}, function (err) {
    //                                 if (err) {
    //                                     throw err;
    //                                 } else {
    //                                     res.setHeader("Content-Type", "application/json");
    //                                     res.json(cover_name);
    //                                     res.end();
    //                                 }
    //                             });
    //                         });
    //                     });
    //                 });
    //         }
    //     }
    // });
};
//上传封面图片
exports.upload = function(req, res) {
    var target_upload_name;
    var _id = req.body._id || req.headers._id;
    var file = req.files.upload || req.files.file;
    if (file && _id) {
        var id = new ObjectID();
        var tmp_upload = file;
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathCO + target_upload_name;
        var filePathC2 = global.imgpathC2 + target_upload_name;
        var filePathC3 = global.imgpathC3 + target_upload_name;
        console.log(tmp_upload_path, target_upload_path);
        changeImageSize(req, tmp_upload_path, target_upload_path, filePathC2, filePathC3, function(err) {
            if (err) {
                console.log("fail : " + err);
            }
            upyunClient.upCityToYun(target_upload_name, function(err, data) {
                if (err) {
                    console.log("Fail to upload to upyun" + err);
                    throw err;
                };
                cityProvider.update({
                    _id: new ObjectID(_id)
                }, {
                    $push: {
                        'image': target_upload_name
                    }
                }, {
                    safe: true
                }, function(err) {
                    if (err) {
                        throw err;
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.json(target_upload_name);
                        res.end();
                    }
                });
            });
        });
    } else {
        res.end();
    }
};

function changeImageSize(req, tmp_path, target_path, target_path_middle, target_path_small, callback) {
    fs.rename(tmp_path, target_path, function(err) {
        if (err) {
            throw err;
        }
        console.log('0:' + err);
        im.crop({
            srcPath: target_path,
            dstPath: target_path_middle,
            width: global.imgsizeC2.width,
            height: global.imgsizeC2.height,
            quality: 1,
            gravity: 'Center'
        }, function(err, metadata) {
            console.log("1:" + err);
            if (err) throw err;
            im.crop({
                srcPath: target_path,
                dstPath: target_path_small,
                width: global.imgsizeC3.width,
                height: global.imgsizeC3.height,
                quality: 1,
                gravity: 'Center'
            }, function(err, metadata) {
                console.log("2:" + err);
                if (err) throw err;
                process.nextTick(callback);
            });
        });
    });
};
exports.delCoverImage = function(req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    fs.unlink(global.imgpathCO + imageName, function() {
        fs.unlink(global.imgpathC2 + imageName, function() {
            fs.unlink(global.imgpathC3 + imageName, function() {
                cityProvider.update({
                    _id: new ObjectID(_id)
                }, {
                    $pull: {
                        'image': imageName
                    }
                }, {
                    safe: true
                }, function(err) {
                    if (err) throw err;
                    upyunClient.delCityFromYun(imageName, function(err, data) {
                        if (err) res.send({
                            'status': 'fail'
                        });
                        res.send({
                            'status': 'success'
                        });
                    });
                });
            });
        });
    });
};

//上传前台页面城市背景大图
exports.upload_background_img = function(req, res) {
    var target_upload_name;
    var _id = req.body._id || req.headers._id;
    var file = req.files.upload || req.files.file;
    if (file && _id) {
        var tmp_upload = file;
        var tmp_upload_path = tmp_upload.path;
        var tmp_upload_type = tmp_upload.type;
        target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = global.imgpathC1 + target_upload_name;
        console.log(target_upload_path);
        makeImageFile(tmp_upload_path, target_upload_path, function() {
            upyunClient.upCityBgToYun(target_upload_name, function(err, data) {
                cityProvider.update({
                    _id: new ObjectID(_id)
                }, {
                    $push: {
                        'backgroundimage': target_upload_name
                    }
                }, {
                    safe: true
                }, function(err) {
                    if (err) {
                        throw err;
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.json(target_upload_name);
                        res.end();
                    }
                });
            });
        });
    } else {
        res.end();
    }
};
//删除背景图片
exports.delBackgroundImage = function(req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    fs.unlink(global.imgpathC1 + imageName, function() {
        cityProvider.update({
            _id: new ObjectID(_id)
        }, {
            $pull: {
                'backgroundimage': imageName
            }
        }, {
            safe: true
        }, function(err) {
            if (err) throw err;
            upyunClient.delCityBgFromYun(imageName, function(err, data) {
                res.send({
                    'status': 'success'
                });
            });
        });
    });
};

function makeImageFile(tmp_path, target_path, callback) {
    fs.rename(tmp_path, target_path, function(err) {
        if (err) {
            throw err;
        }
        callback();
    });
};

function validPic(type) {
    var suffix = type.split('/')[1];
    var _id = new ObjectID();
    return _id + '.' + suffix;
}
// 上传前台页面左边大图 废弃
exports.upload_left_img = function(req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function() {

        cityProvider.findOne({
            _id: new ObjectID(city_id),
            'img_left_Flag': null
        }, {}, function(err, result) {
            if (err) {} else {
                if (result) {
                    cityProvider.update({
                        _id: new ObjectID(city_id)
                    }, {
                        $push: {
                            'img_left': {
                                'imageID': imageID,
                                'imageExtention': fileExtention,
                                'imagename': imageID + '.' + fileExtention
                            }
                        },
                        $set: {
                            "img_left_Flag": true
                        }
                    }, {
                        safe: true
                    }, function(err) {
                        if (err) {
                            res.send({
                                success: false
                            });
                        } else {
                            res.send({
                                success: true
                            });
                        }
                    });

                } else {
                    cityProvider.update({
                        _id: new ObjectID(city_id)
                    }, {
                        $push: {
                            'img_left': {
                                'imageID': imageID,
                                'imageExtention': fileExtention,
                                'imagename': imageID + '.' + fileExtention
                            }
                        }
                    }, {
                        safe: true
                    }, function(err) {
                        if (err) {
                            res.send({
                                success: false
                            });
                        } else {
                            res.send({
                                success: true
                            });
                        }
                    });
                }
            }
        });
    });
};

// 上传前台页面小图 废弃
exports.upload_small_img = function(req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function() {

        cityProvider.findOne({
            _id: new ObjectID(city_id),
            'img_small_Flag': null
        }, {}, function(err, result) {
            if (err) {} else {
                if (result) {
                    cityProvider.update({
                        _id: new ObjectID(city_id)
                    }, {
                        $push: {
                            'img_small': {
                                'imageID': imageID,
                                'imageExtention': fileExtention,
                                'imagename': imageID + '.' + fileExtention
                            }
                        },
                        $set: {
                            "img_small_Flag": true
                        }
                    }, {
                        safe: true
                    }, function(err) {
                        if (err) {
                            res.send({
                                success: false
                            });
                        } else {
                            res.send({
                                success: true
                            });
                        }
                    });

                } else {
                    cityProvider.update({
                        _id: new ObjectID(city_id)
                    }, {
                        $push: {
                            'img_small': {
                                'imageID': imageID,
                                'imageExtention': fileExtention,
                                'imagename': imageID + '.' + fileExtention
                            }
                        }
                    }, {
                        safe: true
                    }, function(err) {
                        if (err) {
                            res.send({
                                success: false
                            });
                        } else {
                            res.send({
                                success: true
                            });
                        }
                    });
                }
            }
        });
    });
};

// 上传前台页面右边中图 废弃
exports.upload_right_middle_img = function(req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function() {

        cityProvider.findOne({
            _id: new ObjectID(city_id),
            'img_right_middle_Flag': null
        }, {}, function(err, result) {
            if (err) {} else {
                if (result) {
                    cityProvider.update({
                        _id: new ObjectID(city_id)
                    }, {
                        $push: {
                            'img_right_middle': {
                                'imageID': imageID,
                                'imageExtention': fileExtention,
                                'imagename': imageID + '.' + fileExtention
                            }
                        },
                        $set: {
                            "img_right_middle_Flag": true
                        }
                    }, {
                        safe: true
                    }, function(err) {
                        if (err) {
                            res.send({
                                success: false
                            });
                        } else {
                            res.send({
                                success: true
                            });
                        }
                    });

                } else {
                    cityProvider.update({
                        _id: new ObjectID(city_id)
                    }, {
                        $push: {
                            'img_right_middle': {
                                'imageID': imageID,
                                'imageExtention': fileExtention,
                                'imagename': imageID + '.' + fileExtention
                            }
                        }
                    }, {
                        safe: true
                    }, function(err) {
                        if (err) {
                            res.send({
                                success: false
                            });
                        } else {
                            res.send({
                                success: true
                            });
                        }
                    });
                }
            }
        });
    });
};
// 上传前台页面左边中图
exports.upload_left_middle_img = function(req, res) {
    var city_id = req.query.city_id;
    var imageID = new ObjectID();
    var filePath = global.imgpath + imageID;
    var fileExtention = req.headers['x-file-name'].split(".").pop();
    var fileStream = fs.createWriteStream(filePath + '.' + fileExtention);
    req.pipe(fileStream);
    req.on('end', function() {

        cityProvider.findOne({
            _id: new ObjectID(city_id),
            'img_left_middle_Flag': null
        }, {}, function(err, result) {
            if (err) {} else {
                if (result) {
                    cityProvider.update({
                        _id: new ObjectID(city_id)
                    }, {
                        $push: {
                            'img_left_middle': {
                                'imageID': imageID,
                                'imageExtention': fileExtention,
                                'imagename': imageID + '.' + fileExtention
                            }
                        },
                        $set: {
                            "img_left_middle_Flag": true
                        }
                    }, {
                        safe: true
                    }, function(err) {
                        if (err) {
                            res.send({
                                success: false
                            });
                        } else {
                            res.send({
                                success: true
                            });
                        }
                    });

                } else {
                    cityProvider.update({
                        _id: new ObjectID(city_id)
                    }, {
                        $push: {
                            'img_left_middle': {
                                'imageID': imageID,
                                'imageExtention': fileExtention,
                                'imagename': imageID + '.' + fileExtention
                            }
                        }
                    }, {
                        safe: true
                    }, function(err) {
                        if (err) {
                            res.send({
                                success: false
                            });
                        } else {
                            res.send({
                                success: true
                            });
                        }
                    });
                }
            }
        });
    });
};

exports.getCityByLabelID = function(req, res) {
    cityProvider.find({
        masterLabel: req.params.labelID
    }, {}, function(err, result) {
        if (err) {
            res.send({
                err: err
            });
        } else {
            res.send(result);
        }
    });
};


exports.addMasterLabelToCities = function(req, res) {
    var data = req.body;
    var labelId = data.labelId + '';
    var cityList = data.cityList;
    stringToObject(cityList, function(new_id) {
        cityProvider.update({
            _id: {
                $in: new_id
            }
        }, {
            $set: {
                masterLabel: labelId
            }
        }, {
            safe: true,
            multi: true
        }, function(err) {
            if (err) throw err;
            res.send('issuccess', true);
        });
    });
};

function stringToObject(strings, callback) {
    var new_id = [];
    for (var i = 0; i < strings.length; i++) {
        new_id.push(new ObjectID(strings[i]));
        if (i == strings.length - 1) {
            callback(new_id)
        }
    }
}
exports.addSubLabelToCities = function(req, res) {
    var data = req.body;
    var labelIds = data.labelIds;
    var cityList = data.cityList;
    stringToObject(cityList, function(new_id) {
        cityProvider.update({
            _id: {
                $in: new_id
            }
        }, {
            $set: {
                subLabel: labelIds
            }
        }, {
            safe: true,
            multi: true
        }, function(err) {
            if (err) throw err;
            res.send('issuccess', true);
        });
    });
}
exports.getCitBackImage = function(req, res) {
    var imageID = req.params.imageId;
    if (imageID != 'undefined') {
        var path = global.imgpathC1 + req.params.imageId;
        fs.exists(path, function(exists) {
            if (exists) {
                fs.readFile(path, "binary", function(err, data) {
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

exports.getCityCoverImage = function(req, res) {
    var imageID = req.params.imageId;
    if (imageID != 'undefined') {
        var path = global.imgpathCO + req.params.imageId;
        fs.exists(path, function(exists) {
            if (exists) {
                fs.readFile(path, "binary", function(err, data) {
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

exports.getCountriesByContinent = function(req, res) {
    var continentCode = req.params.continentCode;
    if (continentCode) {
        Country.getCountriesByContinent(continentCode, function(err, countries) {
            if (err)
                res.send({
                    'status': false
                });
            else
                res.send({
                    'status': true,
                    'countries': countries
                });
        });
    } else {
        res.send({
            'status': false
        });
    }
};

exports.getCityByCountry = function(req, res) {
    var countryCode = req.params.countryCode;
    if (countryCode) {
        cityProvider.find({
            countrycode: countryCode
        }, {
            sort: {
                cityname: 1
            }
        }, function(err, cities) {
            if (err)
                res.send({
                    'status': false
                });
            else
                res.send({
                    'status': true,
                    'cities': cities
                });
        });
    } else {
        res.send({
            'status': false
        });
    }
};

exports.getCountryStatistic = function(req, res) {
    var countryCode = req.params.countryCode;
    cityProvider.find({
        countrycode: countryCode
    }, {
        cityname: 1,
        show_flag: 1
    }, function(err, cities) {
        if (cities) {
            var ep = new EventProxy();
            ep.after('getAll', cities.length, function(list) {
                var online = [];
                var offline = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].show_flag == '1') {
                        online.push(list[i]);
                    } else {
                        offline.push(list[i]);
                    }
                }
                res.send({
                    status: true,
                    online: online,
                    offline: offline
                });
            });
            ep.bind('error', function(err) {
                ep.unbind();
                res.send({
                    status: fasle,
                    err: err
                });
            });
            for (var i = 0; i < cities.length; i++) {
                (function(k) {
                    getCityItemDetail(cities[i], ep.done('getAll'));
                })(i);
            }
        } else {
            res.send({
                status: false,
                err: err === null ? 'not found cities' : err
            });
        }
    });
};

function getCityItemDetail(city, callback) {
    var ep = new EventProxy();
    ep.all('attr_show', 'attr_not_show', 'rest_show', 'rest_not_show', 'shop_show', 'shop_not_show',
        function(attr_show, attr_not_show, rest_show, rest_not_show, shop_show, shop_not_show) {
            var item = {
                city_id: city._id,
                city_name: city.cityname,
                show_flag: city.show_flag,
                attr_show: attr_show,
                attr_not_show: attr_not_show,
                rest_show: rest_show,
                rest_not_show: rest_not_show,
                shop_show: shop_show,
                shop_not_show: shop_not_show
            };
            callback(null, item);
        });
    ep.bind('error', function(err) {
        ep.unbind();
        callback(err);
    });
    Attraction.countByQuery({
        cityid: city._id + '',
        show_flag: '1'
    }, ep.done('attr_show'));
    Attraction.countByQuery({
        cityid: city._id + '',
        show_flag: '0'
    }, ep.done('attr_not_show'));
    Restaurant.count({
        city_id: city._id,
        show_flag: true
    }, ep.done('rest_show'));
    Restaurant.count({
        city_id: city._id,
        show_flag: false
    }, ep.done('rest_not_show'));
    Shopping.count({
        city_id: city._id,
        show_flag: true
    }, ep.done('shop_show'));
    Shopping.count({
        city_id: city._id,
        show_flag: false
    }, ep.done('shop_not_show'));
}