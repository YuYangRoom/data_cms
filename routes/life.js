var Category = require('../proxy').Category;
var Brand = require('../proxy').Brand;
var Event_cms = require('../proxy').Event_cms;
var Version = require('../proxy').Version;
var RecommendRule = require('../proxy').RecommendRule;
var RecommendTime = require('../proxy').RecommendTime;
var News = require('../proxy').News;
var RecommendInfo = require('../proxy').RecommendInfo;
var People = require('../proxy').People;
var Pgc = require('../proxy').Pgc;
var  Banner= require('../proxy').Banner;
var Activity = require('../proxy').Activity;
var Lifetag = require('../proxy').Lifetag;
var Area = require('../proxy').Area;
var City = require('../proxy').City;
var ObjectID = require('mongodb').ObjectID;
var Restaurant = require('../proxy').Restaurant;

var Tripurl = require('../proxy').TripUrl;
var Shopping = require('../proxy').Shopping;
var Entertainment = require('../proxy').Entertainment;
var upyunClient = require('./upyun/upyunClient');
var Util = require('./util');
var logger4js = require('../utils/log').logger;
var ActivityModel = require('../models').Activity;
exports.getCategory = function (req, res) {
    Category.getCategory(new ObjectID(req.params.categoryId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getBrand = function (req, res) {
    Brand.getBrand(new ObjectID(req.params.brandId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getEvent_cms = function (req, res) {
    Event_cms.getEvent_cms(new ObjectID(req.params.event_cmsId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getVersion_mang = function (req, res) {
    Version.getVersion_mang(new ObjectID(req.params.version_mangId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getRecommendRule = function (req, res) {
    RecommendRule.getRecommendRule(new ObjectID(req.params.recommendRuleId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getRecommendTime = function (req, res) {
    RecommendTime.getRecommendTime(new ObjectID(req.params.recommendTimeId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getNews_cms = function (req, res) {
    News.getNews_cms(new ObjectID(req.params.news_cmsId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getRecommendInfo = function (req, res) {
    RecommendInfo.getRecommendInfo(new ObjectID(req.params.recommendInfoId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getPeople = function (req, res) {
    People.getPeople(new ObjectID(req.params.peopleId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getPgc = function (req, res) {
    Pgc.getPgc(new ObjectID(req.params.pgcId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getBanner = function (req, res) {
    Banner.getBanner(new ObjectID(req.params.bannerId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getActivity = function (req, res) {
    Activity.getActivity(new ObjectID(req.params.activityId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getCategoryByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    Category.count(type, function (err, count) {
        Category.getCategorysByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({categorys: result, count: count});
            }
        });
    });
};
exports.getBrandByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    Brand.count(type, function (err, count) {
        Brand.getBrandsByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({brands: result, count: count});
            }
        });
    });
};
exports.getEvent_cmsByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    Event_cms.count(type, function (err, count) {
        Event_cms.getEvent_cmssByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({event_cmss: result, count: count});
            }
        });
    });
};
exports.getVersion_mangByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    Version.count(type, function (err, count) {
        Version.getVersion_mangsByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({version_mangs: result, count: count});
            }
        });
    });
};
exports.getRecommendRuleByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    RecommendRule.count(type, function (err, count) {
        RecommendRule.getRecommendRulesByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({recommendRules: result, count: count});
            }
        });
    });
};
exports.getRecommendTimeByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    RecommendTime.count(type, function (err, count) {
        RecommendTime.getRecommendTimesByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({recommendTimes: result, count: count});
            }
        });
    });
};
exports.getNews_cmsByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;

    News.count(type, function (err, count) {
        News.getNews_cmssByTypeLimit( type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({news_cmss: result, count: count});
            }
        });
    });
};
exports.getRecommendInfoByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    RecommendInfo.count(type, function (err, count) {
        RecommendInfo.getRecommendInfosByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({recommendInfos: result, count: count});
            }
        });
    });
};
exports.getPeopleByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    People.count(type, function (err, count) {
        People.getPeoplesByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({peoples: result, count: count});
            }
        });
    });
};
exports.getPgcByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    Pgc.count(type, function (err, count) {
        Pgc.getPgcsByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({pgcs: result, count: count});
            }
        });
    });
};
exports.getBannerByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    Banner.count(type, function (err, count) {
        Banner.getBannersByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({banners: result, count: count});
            }
        });
    });
};
exports.getActivityByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    Activity.count(type, function (err, count) {
        Activity.getActivitysByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({activitys: result, count: count});
            }
        });
    });
};

exports.getCategorysByQuery = function (req, res) {
    var type = req.params.type;
    var name = req.params.name;
    var query = {};
    if (type) {
        query.type = type;
    }
    if (!Util.isNull(name)) {
        if (Util.trim(name) != "") {
            query.name = {$regex: name};
        }
    }

    Category.getCategorysByQuery(query, function (err, categorys) {
        if (err)
            res.send({err: err});
        else
            res.send({result: categorys});
    });
},
    exports.getBrandsByQuery = function (req, res) {
        var type = req.params.type;
        var title = req.params.title;
        var query = {};
        if (type) {
            query.type = type;
        }
        if (!Util.isNull(title)) {
            if (Util.trim(title) != "") {
                query.title = {$regex: title};
            }
        }

        Brand.getBrandsByQuery(query, function (err, brands) {
            if (err)
                res.send({err: err});
            else
                res.send({result: brands});
        });
    },
    exports.getNews_cmssByQuery = function (req, res) {
        var type = req.params.type;
        var title = req.params.title;
        var query = {};
        if (type) {
            query.type = type;
        }
        if (!Util.isNull(title)) {
            if (Util.trim(title) != "") {
                query.title = {$regex: title};
            }
        }

        News.getNews_cmssByQuery(query, function (err, news_cmss) {
            if (err)
                res.send({err: err});
            else
                res.send({result: news_cmss});
        });
    },
    exports.getRecommendInfosByQuery = function (req, res) {
        var type = req.params.type;
        var title = req.params.title;
        var query = {};
        if (type) {
            query.type = type;
        }
        if (!Util.isNull(title)) {
            if (Util.trim(title) != "") {
                query.title = {$regex: title};
            }
        }

        RecommendInfo.getRecommendInfosByQuery(query, function (err, recommendInfos) {
            if (err)
                res.send({err: err});
            else
                res.send({result: recommendInfos});
        });
    },
    exports.getPeoplesByQuery = function (req, res) {
        var type = req.params.type;
        var title = req.params.title;
        var query = {};
        if (type) {
            query.type = type;
        }
        if (!Util.isNull(title)) {
            if (Util.trim(title) != "") {
                query.username = {$regex: title};
            }
        }

        People.getPeoplesByQuery(query, function (err, peoples) {
            if (err)
                res.send({err: err});
            else
                res.send({result: peoples});
        });
    },
    exports.getPgcsByQuery = function (req, res) {
        var type = req.params.type;
        var title = req.params.title;
        var query = {};
        if (type) {
            query.type = type;
        }
        if (!Util.isNull(title)) {
            if (Util.trim(title) != "") {
                query.title = {$regex: title};
            }
        }
        Pgc.getPgcsByQuery(query, function (err, pgcs) {
            if (err)
                res.send({err: err});
            else
                res.send({result: pgcs});
        });
    },
    exports.getBannersByQuery = function (req, res) {
        var type = req.params.type;
        var title = req.params.title;
        var query = {};
        if (type) {
            query.type = type;
        }
        if (!Util.isNull(title)) {
            if (Util.trim(title) != "") {
                query.title = {$regex: title};
            }
        }

        Banner.getBannersByQuery(query, function (err, banners) {
            if (err)
                res.send({err: err});
            else
                res.send({result: banners});
        });
    },
    exports.postBrandImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            console.log("如果上传文件报错，请在根目录下新建srv/weego/brands/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upBrandToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Brand.updateImage(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postEvent_cmsImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            console.log("如果上传文件报错，请在根目录下新建srv/weego/brands/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upBrandToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Event_cms.updateThumbnail_image(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postEvent_cmsDetailImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            console.log("如果上传文件报错，请在根目录下新建srv/weego/brands/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upBrandToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Event_cms.updateDetail_Image(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postEvent_cmsSign_up_Image = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            console.log("如果上传文件报错，请在根目录下新建srv/weego/brands/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upBrandToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Event_cms.updateSignupImage(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postEvent_cmsPartner_image = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            console.log("如果上传文件报错，请在根目录下新建srv/weego/brands/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upBrandToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Event_cms.updatePartner_image(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postNews_cmsImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            console.log("如果上传文件报错，请在根目录下新建srv/weego/news_cmss/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upNews_cmsToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    News.updateImage(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postRecommendInfoImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            //console.log("如果上传文件报错，请在根目录下新建srv/weego/brands/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upRecommendInfoToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    RecommendInfo.updateImage(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postPeopleImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            console.log("如果上传文件报错，请在根目录下新建srv/weego/peoples/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upPeopleToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    People.updateImage(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postPeopleHead_Image = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            console.log("如果上传文件报错，请在根目录下新建srv/weego/peoples/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upPeopleToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    People.updateImage2(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postPgcOriginImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upPgcOriginImageToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Pgc.updateOriginImage(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postPgcImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            console.log("如果上传文件报错，请在根目录下新建srv/weego/pgcs/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upPgcToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Pgc.updateImage(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postCityImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathCCO + target_upload_name;
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upCityToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    City.updatecityImage(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postCityCoverImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathC2 + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upCityCoverImageToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    //
                    City.updateCityCoverImage(_id,  { $push: {'image': target_upload_name}}, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postBannerImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            var image_type='iphone5_Save';
            //console.log(tmp_upload_path, target_upload_path);
            console.log("如果上传文件报错，请在根目录下新建srv/weego/banners/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upBannerToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Banner.updateImage(_id, image_type,target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postBannerImage_6 = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upBannerToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Banner.updateImage_6(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postBannerImage_plus = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upBannerToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Banner.updateImage_plus(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.postBannerImage_android = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathBrO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upBannerToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Banner.updateImage_android(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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

    },
    exports.delUploadBrandImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            Brand.updateImage(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delBrandFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadEvent_cmsImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            Event_cms.updateThumbnail_image(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delBrandFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadEvent_Detail_Image = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            Event_cms.updateDetail_Image(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delBrandFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadEvent_Sign_up_Image = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            Event_cms.updateSignupImage(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delBrandFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadEvent_Partner_image = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            Event_cms.updatePartner_image(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delBrandFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadNews_cmsImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            News.updateImage(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delNews_cmsFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadRecommendInfoImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            RecommendInfo.updateImage(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delBrandFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadPeopleImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            People.updateImage(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delPeopleFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadPeopleHead_Image = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            People.updateHead_Image(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delPeopleFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadPgcImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            Pgc.updateImage(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delPgcFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadPgcOriginImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathBrO + imageName, function () {
            Pgc.updateOriginImage(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delPgcOriginFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.delUploadCityImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.citypathCCO + imageName, function () {
            City.updatecityImage(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delCityFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
   // ------------Banner图片处理-------------------
    exports.delUploadBannerImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        var image_type= req.params.images_type;;
        fs.unlink(global.imgpathBrO + imageName, function () {
            Banner.updateImage(_id, image_type,"", function (err) {
                if (err) throw err;
                upyunClient.delBannerFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    //--------------------------activity------------------------
    exports.getActivitysByQuery = function (req, res) {
        var type = req.params.type;
        var title = req.params.title;
        var query = {};
        if (type) {
            query.type = type;
        }
        if (!Util.isNull(title)) {
            if (Util.trim(title) != "") {
                query.title = {$regex: title};
            }
        }
        Activity.getActivitysByQuery(query, function (err, activitys) {
            if (err)
                res.send({err: err});
            else
                res.send({result: activitys});
        });
    },
    exports.postActivityImage = function (req, res) {
        var target_upload_name;
        var _id = req.body._id || req.headers._id;
        if (req.files.file && _id) {
            var id = new ObjectID();
            var tmp_upload = req.files.file;
            var tmp_upload_path = tmp_upload.path;
            var tmp_upload_type = tmp_upload.type;
            target_upload_name = validPic(tmp_upload_type);
            var target_upload_path = global.imgpathactO + target_upload_name;
            //console.log(tmp_upload_path, target_upload_path);
            console.log("如果上传文件报错，请在根目录下新建srv/weego/activities/文件夹，仿照其他文件夹建子文件");
            makeImageFile(req, tmp_upload_path, target_upload_path, function () {
                upyunClient.upActivityToYun1(target_upload_name, function (err, data) {
                    if (err) throw err;
                    Activity.updateImage(_id, target_upload_name, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log("activity image save success!");
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
    },
    exports.delUploadActivityImage = function (req, res) {
        var imageName = req.params.image;
        var _id = req.params._id;
        fs.unlink(global.imgpathactO + imageName, function () {
            Activity.updateImage(_id, "", function (err) {
                if (err) throw err;
                upyunClient.delActivityFromYun1(imageName, function (err, data) {
                    if (err) res.send({'status': 'fail'});
                    res.send({'status': 'success'});
                });
            });
        });
    },
    exports.removeCategory = function (req, res) {
        Category.getCategory(new ObjectID(req.params.categoryId + ''), function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                if (result) {
                    result.remove();
                }
                res.send({_id: req.params.categoryId});
            }
        });
    };
exports.removeBrand = function (req, res) {
    Brand.getBrand(new ObjectID(req.params.brandId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.brandId});
        }
    });
};
exports.removeEvent_cms = function (req, res) {
    Event_cms.getEvent_cms(new ObjectID(req.params.event_cmsId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.event_cmsId});
        }
    });
};
exports.removeVersion_mang= function (req, res) {
    Version.getVersion_mang(new ObjectID(req.params.version_mangId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.version_mangId});
        }
    });
};
exports.removeRecommendRule= function (req, res) {
    RecommendRule.getRecommendRule(new ObjectID(req.params.recommendRuleId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.recommendRuleId});
        }
    });
};
exports.removeRecommendTime= function (req, res) {
    RecommendTime.getRecommendTime(new ObjectID(req.params.recommendTimeId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.recommendTimeId});
        }
    });
};
exports.removeNews_cms = function (req, res) {
    News.getNews_cms(new ObjectID(req.params.news_cmsId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.news_cmsId});
        }
    });
};
exports.removeRecommendInfo = function (req, res) {
    RecommendInfo.getRecommendInfo(new ObjectID(req.params.recommendInfoId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.recommendInfoId});
        }
    });
};
exports.removePeople = function (req, res) {
    People.getPeople(new ObjectID(req.params.peopleId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.peopleId});
        }
    });
};
exports.removePgc = function (req, res) {
    Pgc.getPgc(new ObjectID(req.params.pgcId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.pgcId});
        }
    });
};
exports.removeBanner = function (req, res) {
    Banner.getBanner(new ObjectID(req.params.bannerId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.bannerId});
        }
    });
};
exports.removeActivity = function (req, res) {
    Activity.getActivity(new ObjectID(req.params.activityId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.activityId});
        }
    });
};

exports.addNewCategory = function (req, res) {
    var category = req.body;
    Category.newAndSave(category.type, category.name, category.en_name, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewBrand = function (req, res) {
    var brand = req.body;
    //console.log(brand.type+'#'+brand.title+'#'+brand.desc);
    Brand.newAndSave(brand.type, brand.title, brand.advice, brand.desc, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewEvent_cms = function (req, res) {
    var event_cms = req.body;
    Event_cms.newAndSave(event_cms.city, event_cms.name, event_cms.state_info, event_cms.type,event_cms.desc,event_cms.order,event_cms.time, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewVersion_mang= function (req, res) {
    //version,isShow,__v,operating,platform,
    var version_mang = req.body;
    Version.newAndSave(version_mang.version, version_mang.isShow, version_mang.__v, version_mang.operating, version_mang.platform, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewRecommendRule= function (req, res) {
    /*
     one:one,
     two:two,
     three:three,
     four:four,
     five:five,
     six:six,
     seven:seven,
     eight:eight,
    */
    var recommendRule = req.body;
    RecommendRule.newAndSave(recommendRule.one,recommendRule.two,recommendRule.three,recommendRule.four,recommendRule.five,recommendRule.six,recommendRule.seven,recommendRule.eight,recommendRule.isValid, recommendRule.city, recommendRule.type,recommendRule.desc, recommendRule.title, recommendRule.longitude,recommendRule.latitude, recommendRule.range,recommendRule.recom_content,recommendRule.startDate,recommendRule.endDate, recommendRule.week, recommendRule.time_rules, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewRecommendTime= function (req, res) {
    //version,isShow,__v,operating,platform,
    var recommendTime = req.body;
    RecommendTime.newAndSave(recommendTime.city, recommendTime.time_interval, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewNews_cms = function (req, res) {
    var news_cms = req.body;
    News.newAndSave(news_cms.type, news_cms.last_modify_time, news_cms.lead, news_cms.lead_text, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewRecommendInfo = function (req, res) {
    var recommendInfo = req.body;

    RecommendInfo.newAndRecSave(recommendInfo.type,recommendInfo.city_id,recommendInfo.city_name, recommendInfo.recommend_start_date,recommendInfo.recommend_end_date, recommendInfo.recommend_poi_position,
        recommendInfo.recommend_radius, recommendInfo.item, recommendInfo.recommend_start_date_1,recommendInfo.recommend_end_date_1,recommendInfo.recommend_start_time,recommendInfo.recommend_end_time,
        recommendInfo.recommend_poi_lat, recommendInfo.recommend_poi_lon, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewPeople = function (req, res) {
    var people = req.body;

    People.newAndSave(people.type, people.username, people.city_name,people.short_introduce,people.job_desc, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewPgc = function (req, res) {
    var pgc = req.body;
    //console.log(pgc.type+'#'+pgc.title+'#'+pgc.desc);
    Pgc.newAndSave(pgc.type, pgc.title,  pgc.pgc_city, pgc.original,pgc.pgc_people,pgc.pgc_title,pgc.content,pgc.introducation,pgc.pgc_tags,pgc.pgc_country,pgc.pgc_poi, pgc.c_start_time,pgc.start_time, pgc.c_end_time,pgc.end_time, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewBanner = function (req, res) {
    var banner = req.body;
    Banner.newAndSave(banner.ios_url,banner.android_url,banner.type, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};
exports.addNewActivity = function (req, res) {
    var activity = req.body;
    //console.log(activity.type+'#'+activity.title+'#'+activity.desc);
    Activity.newAndSave(activity.type, activity.title, activity.open_time, activity.close_time, activity.desc, activity.price, activity.atype, activity.address,activity.acturl,activity.activity_city,activity.order_url,activity.acttime,activity.deaddress,activity.longitude, activity.latitude, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};

exports.updateCategory = function (req, res) {
    var json = req.body;
    Category.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updateBrand = function (req, res) {

    var json = req.body;
    Brand.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updateEvent_cms = function (req, res) {

    var json = req.body;
    Event_cms.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updateVersion_mang = function (req, res) {

    var json = req.body;
    Version.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updateRecommendRule = function (req, res) {

    var json = req.body;
    RecommendRule.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updateRecommendTime = function (req, res) {

    var json = req.body;
    RecommendTime.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updateNews_cms = function (req, res) {

    var json = req.body;
    News.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updateRecommendInfo = function (req, res) {

    var json = req.body;
    RecommendInfo.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updatePeople = function (req, res) {

    var json = req.body;
    People.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updatePgc = function (req, res) {

    var json = req.body;
    Pgc.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updateBanner = function (req, res) {
    var json = req.body;
    Banner.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};
exports.updateActivity = function (req, res) {
    var json = req.body;
    Activity.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};

//---------------------------lifetag---------------------------------------------

exports.getLifetag = function (req, res) {
    Lifetag.getLifetag(new ObjectID(req.params.lifetagId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getLifetagByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var type = req.params.type;
    if (!type)
        type = '1';
    Lifetag.count(type, function (err, count) {
        Lifetag.getLifetagsByTypeLimit(type, skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({lifetags: result, count: count});
            }
        });
    });
};

exports.getLifetagsByType = function (req, res) {
    Lifetag.getLifetagsByType(req.params.type, function (err, lifetags) {
        if (err)
            res.send({err: err});
        else
            res.send({result: lifetags});
    });
},
    exports.getBrandtagsByType = function (req, res) {
        Brand.getBrandtagsByType(req.params.type, req.params.key, function (err, brands) {
            if (err)
                res.send({err: err});
            else
                res.send({result: brands});
        });
    },
    exports.getNews_cmstagsByType = function (req, res) {
        News_cms.getNews_cmstagsByType(req.params.type, req.params.key, function (err, news_cmss) {
            if (err)
                res.send({err: err});
            else
                res.send({result: news_cmss});
        });
    },
    exports.getRecommendInfotagsByType = function (req, res) {
        RecommendInfo.getRecommendInfotagsByType(req.params.type, req.params.key, function (err, recommendInfos) {
            if (err)
                res.send({err: err});
            else
                res.send({result: recommendInfos});
        });
    },
    exports.getPeopletagsByType = function (req, res) {
        People.getPeopletagsByType(req.params.type, req.params.key, function (err, peoples) {
            if (err)
                res.send({err: err});
            else
                res.send({result: peoples});
        });
    },
    exports.getrecommendTimesByType = function (req, res) {
        RecommendTime.getRecommendTimetagsByType( req.params.key, function (err, peoples) {
            if (err)
                res.send({err: err});
            else
                res.send({result: peoples});
        });
    },
    exports.getPgctagsByType = function (req, res) {
        Pgc.getPgctagsByType(req.params.type, req.params.key, function (err, pgcs) {
            if (err)
                res.send({err: err});
            else
                res.send({result: pgcs});
        });
    },
    exports.getActivitytagsByType = function (req, res) {
        Activity.getActivitytagsByType(req.params.type, req.params.key, function (err, activitys) {
            if (err)
                res.send({err: err});
            else
                res.send({result: activitys});
        });
    },
    exports.getShoptagsByType = function (req, res) {
        Category.getShoptagsByType(req.params.type, req.params.key, function (err, shops) {
            if (err)
                res.send({err: err});
            else
                res.send({result: shops});
        });
    },
    exports.getRestagsByType = function (req, res) {
        Category.getRestagsByType(req.params.type, req.params.key, function (err, ress) {
            if (err)
                res.send({err: err});
            else
                res.send({result: ress});
        });
    },
    exports.removeLifetag = function (req, res) {
        Lifetag.getLifetag(new ObjectID(req.params.lifetagId + ''), function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                if (result) {
                    result.remove();
                }
                res.send({_id: req.params.lifetagId});
            }
        });
    };


exports.addNewLifetag = function (req, res) {
    var lifetag = req.body;
    Lifetag.newAndSave(lifetag.type, lifetag.name, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};

exports.updateLifetag = function (req, res) {
    var json = req.body;
    Lifetag.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};

//---------------------------area---------------------------------------------

exports.getArea = function (req, res) {
    Area.getArea(new ObjectID(req.params.areaId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};
exports.getAreaByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Area.count(function (err, count) {
        Area.getAreasByLimit(skip, req.params.pageLimit, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({areas: result, count: count});
            }
        });
    });
};

exports.getAreasByCityId = function (req, res) {
    var query = {city_id: new ObjectID(req.params.cityId + '')};
    Area.getAreasByQuery(query, function (err, areas) {
        if (err) {
            res.send({status: false, err: err});
        } else {
            res.send({status: true, results: areas});
        }
    });
};
exports.getAreasByCityName = function (req, res) {
    var city_name = req.query.cityname;
    var area_name = req.query.areaname;
    var query = {};
    if (Util.trim(city_name) != '') {
        //query.city_name = city_name;
        var city_name_2 = eval("/" + city_name + "/");
        if (Util.trim(area_name) != '') {
            var area_name_2 = eval("/" + area_name + "/");
            query = {city_name: city_name_2, area_name: area_name_2};
        } else {
            var city_name_2 = eval("/" + city_name + "/");
            query = {city_name: city_name_2};
        }
    } else if (Util.trim(area_name) != '') {
        var area_name_2 = eval("/" + area_name + "/");
        query = { area_name: area_name_2};
        //query.area_name = eval("/" + area_name + "/");
    }
    Area.getAreasByQuery(query, function (err, results) {
        if (err) {
            res.send({status: false, err: err});
        } else {
            res.send({ areas:results,status: true});
        }
    });
};
exports.getActivitysByName = function (req, res) {
    var city_name = req.query.cityname;
    var name = req.query.areaname;
    var type = req.query.type;
    var query = {type:type};
    if (Util.trim(city_name) != ''&& Util.trim(name) != '') {
        var city_name_2 = eval("/" + city_name + "/");
        var  name_2 = eval("/" + name + "/");
        query = { 'title': name_2,'activity_city.cityname':city_name_2};
        //query = {'activity_city.cityname':city_name_2};
    }else  if (Util.trim(city_name) != '') {
        var city_name_2 = eval("/" + city_name + "/");
        query = {'activity_city.cityname':city_name_2};
    }else if(Util.trim(name) != ''){
        var  name_2 = eval("/" + name + "/");
        query = { title: name_2};
    }

   /* if (Util.trim(name) != '') {
        var  name_2 = eval("/" + name + "/");
        query = { 'title': name_2,'activity_city.cityname':city_name_2};
    }else{
        var  name_2 = eval("/" + name + "/");
        query = { title: name_2};
    }*/
    //Activity.count(function (err, count) {
    Activity.getactivityByQuery(query, function (err, results) {
        if (err) {
            res.send({status: false, err: err});
        } else {
            res.send({ activitys:results,count:20});
        }
    });
    //});
};
exports.getPgcsByName = function (req, res) {
    var city_name = req.query.cityname;
    var name = req.query.areaname;
    var type = req.query.type;
    var query = {type:type};
    if (Util.trim(city_name) != ''&& Util.trim(name) != '') {
        var city_name_2 = eval("/" + city_name + "/");
        var  name_2 = eval("/" + name + "/");
        query = { 'title': name_2,'pgc_city.cityname':city_name_2};
        //query = {'activity_city.cityname':city_name_2};
    }else  if (Util.trim(city_name) != '') {
        var city_name_2 = eval("/" + city_name + "/");
        query = {'pgc_city.cityname':city_name_2};
    }else if(Util.trim(name) != ''){
        var  name_2 = eval("/" + name + "/");
        query = { title: name_2};
    }
    Pgc.getPgc_ByQuery(query, function (err, results) {
        if (err) {
            res.send({status: false, err: err});
        } else {
            res.send({ pgcs:results,count:20});
        }
    });
    //});
};
exports.getbrandssByName = function (req, res) {
    //var city_name = req.query.cityname;
    var name = req.query.areaname;
    var type = req.query.type;
    var query = {type:type};
  /*  if (Util.trim(city_name) != '') {
        var city_name_2 = eval("/" + city_name + "/");
        if (Util.trim(area_name) != '') {
            var area_name_2 = eval("/" + area_name + "/");
            query = {type:type,city_name: city_name_2, area_name: area_name_2};
        } else {
            var city_name_2 = eval("/" + city_name + "/");
            query = {type:type,city_name: city_name_2};
        }
    } else*/
    if (Util.trim(name) != '') {
        var  name_2 = eval("/" + name + "/");
        query = { title: name_2};
    }
    //Activity.count(function (err, count) {
    Brand.getbrandByQuery(query, function (err, results) {
        if (err) {
            res.send({status: false, err: err});
        } else {
            res.send({ brands:results,count:20});
        }
    });
    //});
};

exports.getnews_cmsssByName = function (req, res) {
    var name = req.query.areaname;
   var query={};
    if (Util.trim(name) != '') {
        var  lead_2 = eval("/" + name + "/");
        query = { lead: lead_2};
    }
    News.count_query(query,function(err,count){
        News.getnews_cmsByQuery(query, function (err, results) {
            if (err) {
                res.send({status: false, err: err});
            } else {
                res.send({ news_cmss:results,count:count});
            }
        });
    });

    //});
};

exports.getrecommendInfossByName = function (req, res) {
    var city_name = req.query.cityname;
    var recommend_name = req.query.recommend_name;
    var  query={};
    if (Util.trim(recommend_name) != '' && Util.trim(city_name) != '') {
        var recommend_name_2 = eval("/" + recommend_name + "/");
        var city_name_2 = eval("/" + city_name + "/");
        query = {'recommend_content.recommend_content_title': recommend_name_2, city_name: city_name_2};
    } else if (Util.trim(city_name) != '') {
        var city_name_2 = eval("/" + city_name + "/");
        query = {city_name: city_name_2};
    } else if (Util.trim(recommend_name) != '') {
        var recommend_name_2 = eval("/" + recommend_name + "/");
        query = {'recommend_content.recommend_content_title': recommend_name_2};
    }
    RecommendInfo.count_byName(query,function (err, count) {
    RecommendInfo.getrecommendInfoByQuery(query, function (err, results) {
        if (err) {
            res.send({status: false, err: err});
        } else {
            res.send({ recommendInfos:results,count:count});
        }
    });
    });
};

exports.removeArea = function (req, res) {
    Area.getArea(new ObjectID(req.params.areaId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.areaId});
        }
    });
};

exports.addNewArea = function (req, res) {
    var area = req.body;
    //console.log(area);
    Area.newAndSave(area, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id});
        }
    });
};

exports.updateArea = function (req, res) {
    var json = req.body;
    Area.update(json, function (err, new_one) {
        if (err) {
            res.send({err: err});
        } else {
            res.send({isSuccess: true});
        }
    });
};

//-----------------------------------restaurant-----------------------------------

// exports.getRestaurant = function(req, res){
//     Restaurant.getRestaurantsByQuery({_id : req.params.restaurantId}, function (err, result) {
//         if (err) {
//             res.send({err:err});
//         } else {
//             console.log("====================================================");
//             console.log(result);
//             res.send(result);
//         }
//     });
// };
exports.getRestaurant = function (req, res) {
    Restaurant.getRestaurantsByQuery(new ObjectID(req.params.restaurantId + ''), function (err, result) {
        if (err) {
            console.log(err);
            res.send({err: err});
        } else {
            //console.info(result);
            res.send(result);
        }
    });
};
exports.getRestaurantsByFlag = function (req, res) {
    var lifename = req.query.lifename;
    var cityname = req.query.cityname,
        most_popular = req.query.most_popular,
        best_dinnerchoics = req.query.best_dinnerchoics,
        michilin_flag = req.query.michilin_flag,
        local_flag = req.query.local_flag;
    var con = {};
    if (lifename) {
        con.name = {
            $regex: Util.trim(lifename)
        };
    }
    if (cityname) {
        con.city_name = Util.trim(cityname);
    }
    if (most_popular != '') {
        con.most_popular = most_popular;
    }
    if (best_dinnerchoics != '') {
        con.best_dinnerchoics = best_dinnerchoics;
    }
    if (michilin_flag != '') {
        con.michilin_flag = michilin_flag;
    }
    if (local_flag != '') {
        con.local_flag = local_flag;
    }
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Restaurant.count(con, function (err, count) {
        Restaurant.getRestaurants(skip, req.params.pageLimit, con, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({results: result, count: count});
            }
        });
    });
}

exports.getRestaurantByPage = function (req, res) {
    var lifename = req.query.lifename,
        cityname = req.query.cityname,
        pagelimit = req.params.pageLimit,
        tags = req.query.tags;
    console.log(tags);
    var con = {};
    var tagsArr = [];
    if (lifename) {
        con.name = {$regex: Util.trim(lifename)};
    }
    if (cityname) {
        con.city_name = Util.trim(cityname);
    }
    if (tags) {
        tagsArr = tags.split(",");
        if (tagsArr[0] == "") {
            tagsArr.splice(0, 1);
        }
        con.tags = {$all: tagsArr};
    }
    var skip = pagelimit * (req.params.pageIndex - 1);
    Restaurant.count(con, function (err, count) {
        Restaurant.getRestaurants(skip, pagelimit, con, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({results: result, count: count});
            }
        });
    });
};
exports.removeRestaurant = function (req, res) {
    Restaurant.getRestaurant(new ObjectID(req.params.restaurantId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.restaurantId});
        }
    });
};

exports.addNewRestaurant = function (req, res) {
    var restaurant = (req.body);
    //console.log(req.body.placeId);
    // var restaurant = JSON.parse(req.body);
    Restaurant.newAndSave(restaurant, function (err, result) {
        if (err) {
            throw err;
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id, user_id: req.session.user._id});
        }
    });
};

exports.updateRestaurant = function (req, res) {
    var tripid = req.body._id;
    var type = '1';
    var tripurl = req.body.comments_url;
    if (tripurl.indexOf('Restaurant_Review') > 0) {
        logger4js.info('tripurl:' + tripurl + '#' + tripid + '#' + type);
        Tripurl.tripwebUrl(tripid, type, tripurl, function (err, result) {
            if (err) {
                console.log(err);
                process.exit();
            }
            process.exit();
        });
    }
    var json = req.body;
    Restaurant.update(json, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id, user_id: req.session.user._id});
        }
    });

};

exports.publishRestaurant = function (_id, callback) {
    Restaurant.updateShowFlag(_id, true, callback);
};

//-----------------------------------shopping-----------------------------------

exports.getShopping = function (req, res) {
    //console.log("full shoppinglllllllllllllllll");
    Shopping.getFullShopping(new ObjectID(req.params.shoppingId + ''), function (err, result) {
        if (err) {
            console.log(err);
            res.send({err: err});
        } else {
            //console.info(result);
            res.send(result);
        }
    });
};

exports.getShoppingByPage = function (req, res) {
    var lifename = req.query.lifename;
    var cityname = req.query.cityname;
    var areaname = req.query.areaname;
    var con = {};
    if (lifename) {
        con.name = {$regex: Util.trim(lifename)};
    }
    if (cityname) {
        con.city_name = {$regex: Util.trim(cityname)};
    }
    if (areaname) {
        con.$or = [{area_name: areaname}, {area_enname: areaname}];
    }
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Shopping.count(con, function (err, count) {
        //console.log(count);
        Shopping.getShoppings(skip, req.params.pageLimit, con, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                //console.log("=====================");
                //console.log(result);
                res.send({results: result, count: count});
            }
        });
    });
};

exports.getBigShoppingByCityId = function (req, res) {
    var cityId = req.params.cityId;
    var query = {city_id: new ObjectID(cityId + '')};
    query.is_big = true;
    Shopping.getShoppingsByQuery(query, function (err, shoppings) {
        if (err) {
            res.send({status: false, err: err});
        } else {
            res.send({status: true, results: shoppings});
        }
    });
};

exports.removeShopping = function (req, res) {
    Shopping.getShopping(new ObjectID(req.params.shoppingId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.shoppingId});
        }
    });
};

exports.addNewShopping = function (req, res) {
    var shopping = req.body;
    Shopping.newAndSave(shopping, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id, user_id: req.session.user._id});
        }
    });
};
exports.updateShopping = function (req, res) {
    var tripid = req.body._id;
    var type = '2';
    var tripurl = req.body.comments_url;
    if (tripurl.indexOf('Attraction_Review') > 0) {
        logger4js.info('tripurl:' + tripurl + '#' + tripid + '#' + type);
        Tripurl.tripwebUrl(tripid, type, tripurl, function (err, result) {
            if (err) {
                console.log(err);
                process.exit();
            }
            process.exit();
        });
    }

    if (req.body.activities.length > 0) {
        for (var i = 0; i < req.body.activities.length; i++) {
            var _id = new ObjectID(req.body.activities[i]._id);
            ActivityModel.findOne({_id: _id}, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result) {
                        if (typeof(result.longitude) == 'undefined' && req.body.longitude && req.body.latitude) {
                            result.latitude = req.body.latitude;
                            result.longitude = req.body.longitude;
                            result.save(function (err, data) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }

                    }
                }

            });
        }
    }


    var json = req.body;
    Shopping.update(json, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id, user_id: req.session.user._id});
        }
    });
};

exports.publishShopping = function (_id, callback) {
    Shopping.updateShowFlag(_id, true, callback);
};

//-----------------------------------entertainment-----------------------------------

exports.getEntertainment = function (req, res) {
    Entertainment.getEntertainment(new ObjectID(req.params.entertainmentId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            res.send(result);
        }
    });
};

exports.getEntertainmentByPage = function (req, res) {
    var lifename = req.query.lifename;
    var cityname = req.query.cityname;
    var con = {};
    if (lifename) {
        con.name = {$regex: Util.trim(lifename)};
    }
    if (cityname) {
        con.city_name = Util.trim(cityname);
    }
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Entertainment.count(con, function (err, count) {
        Entertainment.getEntertainments(skip, req.params.pageLimit, con, function (err, result) {
            if (err) {
                res.send({err: err});
            } else {
                res.send({results: result, count: count});
            }
        });
    });
};

exports.removeEntertainment = function (req, res) {
    Entertainment.getEntertainment(new ObjectID(req.params.entertainmentId + ''), function (err, result) {
        if (err) {
            res.send({err: err});
        } else {
            if (result) {
                result.remove();
            }
            res.send({_id: req.params.entertainmentId});
        }
    });
};

exports.addNewEntertainment = function (req, res) {
    var entertainment = req.body;
    Entertainment.newAndSave(entertainment, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id, user_id: req.session.user._id});
        }
    });
};

exports.updateEntertainment = function (req, res) {
    var json = req.body;
    Entertainment.update(json, function (err, result) {
        if (err) {
            res.send({isSuccess: false, info: err});
        } else {
            res.send({isSuccess: true, _id: result._id, user_id: req.session.user._id});
        }
    });
};

exports.publishEntertainment = function (_id, callback) {
    Entertainment.updateShowFlag(_id, true, callback);
};

//-----------------------------------image-----------------------------------------

exports.postLifeImage = function (req, res) {
    var type = req.body._type || req.headers.type;
    //console.log(req.files, req.headers);
    var _id = req.body._id || req.headers._id;
    if (req.files.file && _id) {
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        //新的图片上传插件需要的接口
        var tmp_upload_type = tmp_upload.type;
        var target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = getPathByType(type) + target_upload_name;
        // var target_upload_path = './public/images/' + target_upload_name;
        makeImageFile(req, tmp_upload_path, target_upload_path, function () {
            upyunClient.upLifeToYun(type, target_upload_name, function (err, data) {
                if (err) throw err;
                pushImg(_id, type, target_upload_name, function (err, result) {
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
//------------------menu-------------------------------
exports.UpdateUploadMenu = function (req, res) {
    var imageName = req.body.name;
    var _id = req.body._id;
    var desc = req.body.desc;
    var advice = req.body.advice;
    var target_upload_name = imageName;
    pullMenu(_id, "1", target_upload_name, function (err, result) {
        if (err)res.send({'status': 'fail'});
        pushMenu(_id, "1", "menu", desc, advice, target_upload_name, function (err, result) {//這個type能被用到么？
            if (err) res.send({'status': 'fail'});
            res.send({'status': 'success'});
        });
    });
}
exports.UpdateUploadPgc_image_desc = function (req, res) {
    var imageName = req.body.name;
    var _id = req.body._id;
    var p_desc = req.body.p_desc;
    var image_title = req.body.image_title;
    var p_PGC_Id = req.body.p_PGC_Id;
    var target_upload_name = imageName;
    pull_Pgc_image_desc(_id, "1", target_upload_name, function (err, result) {
        if (err)res.send({'status': 'fail'});
        pushPgc_image_desc(_id,  p_desc, image_title, p_PGC_Id, target_upload_name, function (err, result) {
            if (err) res.send({'status': 'fail'});
            res.send({'status': 'success'});
        });
    });
}
exports.UpdateUploadNews_Cms_image_desc = function (req, res) {
    var imageName = req.body.name;
    var _id = req.body._id;
    var newsInfo_title = req.body.newsInfo_title;
    var newsInfo_url = req.body.newsInfo_url;
    var newsInfo_text = req.body.newsInfo_text;
    var newsInfo_source = req.body.newsInfo_source;
    var newsInfo_date = req.body.newsInfo_date;
    var newsInfo_image_desc = req.body.newsInfo_image_desc;
    var target_upload_name = imageName;
    pull_News_Cms_image_desc(_id, target_upload_name, function (err, result) {
        if (err)res.send({'status': 'fail'});
        pushNews_CMS_image_desc(_id,  newsInfo_title, newsInfo_url, newsInfo_text,newsInfo_source,newsInfo_date,newsInfo_image_desc, target_upload_name, function (err, result) {
            if (err) res.send({'status': 'fail'});
            res.send({'status': 'success'});
        });
    });
}
exports.UpdateUploadActivity_image = function (req, res) {
    var imageName = req.body.name;
    var _id = req.body._id;
    var p_desc = req.body.p_desc;
    var image_desc = req.body.image_desc;
    var p_title = req.body.p_title;
    var target_upload_name = imageName;
    pullActivity_image(_id, "1", target_upload_name, function (err, result) {
        if (err)res.send({'status': 'fail'});
        push_Activity(_id,  p_desc,  image_desc, p_title, target_upload_name, function (err, result) {//這個type能被用到么？
            if (err) res.send({'status': 'fail'});
            res.send({'status': 'success'});
        });
    });
}
exports.UpdateUploadMenu_people = function (req, res) {
    var imageName = req.body.name;
    var _id = req.body._id;
    var p_desc = req.body.p_desc;
    var p_title = req.body.p_title;
    var target_upload_name = imageName;
    pullMenu_people(_id, "1", target_upload_name, function (err, result) {
        if (err)res.send({'status': 'fail'});
        pushPeople(_id,  p_desc, p_title, target_upload_name, function (err, result) {//這個type能被用到么？
            if (err) res.send({'status': 'fail'});
            res.send({'status': 'success'});
        });
    });
}
exports.postLifeMenu = function (req, res) {
    var type = req.body._type || req.headers.type;
    var desc = req.body._desc;
    var flag = req.body._flag;
    var advice = req.body._advice;
    //console.log(req.files, req.headers);
    var _id = req.body._id || req.headers._id;
    if (req.files.file && _id) {
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        //新的图片上传插件需要的接口
        var tmp_upload_type = tmp_upload.type;
        var target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = getPathByType(type) + target_upload_name;
        // var target_upload_path = './public/images/' + target_upload_name;
        makeImageFile(req, tmp_upload_path, target_upload_path, function () {
            upyunClient.upLifeToYun(type, target_upload_name, function (err, data) {
                if (err) throw err;
                pushMenu(_id, type, flag, desc, advice, target_upload_name, function (err, result) {//這個type能被用到么？
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
exports.postLife_Activity = function (req, res) {
    var type = req.body._type || req.headers.type;
    var p_desc = req.body.p_desc;
    var image_desc = req.body.image_desc;
    var p_title = req.body.p_title;
    var _id = req.body._id || req.headers._id;
    if (req.files.file && _id) {
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        //新的图片上传插件需要的接口
        var tmp_upload_type = tmp_upload.type;
        var target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = getPathByType(type) + target_upload_name;
        // var target_upload_path = './public/images/' + target_upload_name;
        makeImageFile(req, tmp_upload_path, target_upload_path, function () {
            upyunClient.upActivity_images_ToYun(type, target_upload_name, function (err, data) {
                if (err) throw err;
                pushActivity_images(_id,p_desc,image_desc,p_title, target_upload_name, function (err, result) {
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
exports.postLifeMenu2 = function (req, res) {
    var type = req.body._type || req.headers.type;
    var p_desc = req.body.p_desc;
    var p_title = req.body.p_title;
    var _id = req.body._id || req.headers._id;
    if (req.files.file && _id) {
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        //新的图片上传插件需要的接口
        var tmp_upload_type = tmp_upload.type;
        var target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = getPathByType(type) + target_upload_name;
        // var target_upload_path = './public/images/' + target_upload_name;
        makeImageFile(req, tmp_upload_path, target_upload_path, function () {
            upyunClient.upLifeToYun(type, target_upload_name, function (err, data) {
                if (err) throw err;
                pushPeople(_id,p_desc,p_title, target_upload_name, function (err, result) {
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
exports.postPgc_image_desc = function (req, res) {
    var type = req.body._type || req.headers.type;
    var p_desc = req.body.p_desc;
    var image_title = req.body.image_title;
    var p_PGC_Id = req.body.p_PGC_Id;
    var _id = req.body._id || req.headers._id;
    if (req.files.file && _id) {
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        //新的图片上传插件需要的接口
        var tmp_upload_type = tmp_upload.type;
        var target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = getPathByType(type) + target_upload_name;
        // var target_upload_path = './public/images/' + target_upload_name;
        makeImageFile(req, tmp_upload_path, target_upload_path, function () {
            upyunClient.upPgc_images_ToYun(type, target_upload_name, function (err, data) {
                if (err) throw err;
                pushPgc_image_desc(_id,p_desc,image_title, p_PGC_Id, target_upload_name, function (err, result) {
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
exports.postNews_CMS_image_desc = function (req, res) {
    var type = req.body._type || req.headers.type;
    var newsInfo_title = req.body.newsInfo_title;
    var newsInfo_url = req.body.newsInfo_url;
    var newsInfo_text = req.body.newsInfo_text;
    var newsInfo_source = req.body.newsInfo_source;
    var newsInfo_date = req.body.newsInfo_date;
    var newsInfo_image_desc = req.body.newsInfo_image_desc;
    var _id = req.body._id || req.headers._id;
    if (req.files.file && _id) {
        var id = new ObjectID();
        var tmp_upload = req.files.file;
        var tmp_upload_path = tmp_upload.path;
        //新的图片上传插件需要的接口
        var tmp_upload_type = tmp_upload.type;
        var target_upload_name = validPic(tmp_upload_type);
        var target_upload_path = getPathByType(type) + target_upload_name;
        // var target_upload_path = './public/images/' + target_upload_name;
        makeImageFile(req, tmp_upload_path, target_upload_path, function () {
            upyunClient.upNews_CMS_images_ToYun(type, target_upload_name, function (err, data) {
                if (err) throw err;
                pushNews_CMS_image_desc(_id,newsInfo_title, newsInfo_url,newsInfo_text, newsInfo_source,newsInfo_date,newsInfo_image_desc, target_upload_name, function (err, result) {
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
exports.uploadAreaImg = function (req, res) {
    var _id = req.body._id || req.headers._id;
    var tmp_path = req.files.file.path;
    var filename = req.files.file.name;
    var target_path = global.imgpathSO + filename;
    //移动文件
    //console.log(tmp_path + ", " + target_path);
//    fs.rename(tmp_path, target_path, function(err){
    //       if(err) throw err;
    makeImageFile(req, tmp_path, target_path, function () {
        upyunClient.upAreaToYun(filename, function (err, data) {
            if (err) throw err;
            Area.pushImg(_id, filename, function (err, result) {
                if (err) throw err;
                res.end();
            })
        });
    });
    //  })
}

exports.delAreaImg = function (req, res) {
    var id = req.params.id;
    var imageName = req.params.imageName;
    var target_path = global.imgpathSO + imageName;
    fs.unlink(target_path, function (err) {
        //if(err) throw err;
        Area.pullImg(id, imageName, function (err, result) {
            if (err) throw err;
            upyunClient.delAreaFromYun(imageName, function (err, data) {
                if (err) res.send({'status': 'fail'});
                res.send({'status': 'success'});
            })
        })
    })
}

exports.setAreaCoverImg = function (req, res) {
    var imageName = req.params.imageName;
    var id = req.params.id;
    Area.setAreaCoverImg(id, imageName, function (err, result) {
        if (err) throw err;
        res.setHeader("Content-Type", "application/json");
        res.json(imageName);
        res.end();
    })
}

function validPic(type) {
    var suffix = type.split('/')[1];
    var _id = new ObjectID();
    return _id + '.' + suffix;
}
function makeImageFile(req, tmp_path, target_path, callback) {
    fs.rename(tmp_path, target_path, function (err) {
        if (err) {
            throw err;
        }
        process.nextTick(callback);
    });
}

exports.delUploadImageLife = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    var type = req.params._type;
    fs.unlink(getPathByType(type) + imageName, function () {
        pullImg(_id, type, imageName, function (err, result) {
            if (err) throw err;
            upyunClient.delLifeFromYun(type, imageName, function (err, data) {
                if (err) res.send({'status': 'fail'});
                res.send({'status': 'success'});
            });
        });
    });

};
exports.delUploadMenuLife = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    var type = req.params._type;
    //var desc = req.params.desc;
    fs.unlink(getPathByType(type) + imageName, function () {
        pullMenu(_id, type, imageName, function (err, result) {
            if (err) throw err;
            upyunClient.delLifeFromYun('1', imageName, function (err, data) {
                if (err) res.send({'status': 'fail'});
                res.send({'status': 'success'});
            });
        });
    });

};
exports.delUploadActivity_image = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    var type = req.params._type;
    //var desc = req.params.desc;
    fs.unlink(getPathByType(type) + imageName, function () {
        pullActivity_image(_id, type, imageName, function (err, result) {
            if (err) throw err;
            upyunClient.delLifeFromYun('1', imageName, function (err, data) {
                if (err) res.send({'status': 'fail'});
                res.send({'status': 'success'});
            });
        });
    });

};
exports.delUpload_Pgc_image_desc = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    var type = req.params._type;
    //var desc = req.params.desc;
    fs.unlink(getPathByType(type) + imageName, function () {
        pull_Pgc_image_desc(_id, type, imageName, function (err, result) {
            if (err) throw err;
            upyunClient.delLifeFromYun('1', imageName, function (err, data) {
                if (err) res.send({'status': 'fail'});
                res.send({'status': 'success'});
            });
        });
    });

};
exports.delUpload_News_cms_image_desc = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    var type = req.params._type;
    //var desc = req.params.desc;
    fs.unlink(getPathByType(type) + imageName, function () {
        pull_News_Cms_image_desc(_id,imageName, function (err, result) {
            if (err) throw err;
            upyunClient.delLifeFromYun('1', imageName, function (err, data) {
                if (err) res.send({'status': 'fail'});
                res.send({'status': 'success'});
            });
        });
    });

};
exports.delUploadMenuLife_people = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    var type = req.params._type;
    //var desc = req.params.desc;
    fs.unlink(getPathByType(type) + imageName, function () {
        pullMenu_people(_id, type, imageName, function (err, result) {
            if (err) throw err;
            upyunClient.delLifeFromYun('1', imageName, function (err, data) {
                if (err) res.send({'status': 'fail'});
                res.send({'status': 'success'});
            });
        });
    });

};
exports.setCoverImgLife = function (req, res) {
    var imageName = req.params.imageName;
    var _id = req.params._id;
    var type = req.params._type;
    setCoverImg(_id, type, imageName, function (err, result) {
        if (err) {
            throw err;
        } else {
            res.setHeader("Content-Type", "application/json");
            res.json(imageName);
            res.end();
        }
    });
};

function getPathByType(type) {
    if (type == '1')
        return global.imgpathEO;
    else if (type == '2')
        return global.imgpathFO;
    else
        return global.imgpathGO;
}
function pushMenu(_id, type, flag, desc, advice, target_upload_name, callback) {
    if (flag == 'menu') {
        Restaurant.getRestaurant(new ObjectID(_id), function (err, result) {
            if (result) {
                var item = {cover_image: target_upload_name, desc: desc, advice: advice};
                result.menu.push(item);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    }
}
function pushActivity_images(_id,p_desc, image_desc,p_title, target_upload_name, callback) {
    //if (flag == 'menu') {
        Activity.getActivity(new ObjectID(_id), function (err, result) {
            if (result) {
                var item = {title:p_title,image_id: target_upload_name, desc:p_desc,image_desc:image_desc };
                result.images_desc.push(item);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    //}
}
function push_Activity(_id,  p_desc, image_desc,p_title, target_upload_name, callback) {
    //if (flag == 'menu') {
        Activity.getActivity(new ObjectID(_id), function (err, result) {
            if (result) {
                var item = {title:p_title,image_id: target_upload_name, desc:p_desc,image_desc:image_desc };
                result.images_desc.push(item);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    //}
}
function pushPgc_image_desc(_id,  p_desc,image_title,p_PGC_Id, target_upload_name, callback) {
    //if (flag == 'menu') {
        Pgc.getPgc(new ObjectID(_id), function (err, result) {
            var p_title_ch='';
            var p_PGC_Id_ch='';
            if (result) {
                if(image_title!=null){
                    p_title_ch=image_title;
                }
                if(p_PGC_Id!=null){
                    p_PGC_Id_ch=p_PGC_Id;
                }
                var item = {image_title:p_title_ch,section_image: target_upload_name ,p_PGC_Id: p_PGC_Id_ch };
                result.pgc_images_desc.push(item);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    //}
}
//newsInfo_title, newsInfo_url,newsInfo_text, newsInfo_source,newsInfo_date,newsInfo_image_desc,
function pushNews_CMS_image_desc(_id,newsInfo_title,newsInfo_url,newsInfo_text,newsInfo_source,newsInfo_date,newsInfo_image_desc, target_upload_name, callback) {
    //if (flag == 'menu') {
        News.getNews_cms(new ObjectID(_id), function (err, result) {
            var newsInfo_title_2='';
            var newsInfo_url_2='';
            var newsInfo_text_2='';
            var newsInfo_source_2='';
            var newsInfo_date_2='';
            var newsInfo_image_desc_2='';
            if (result) {
                if(newsInfo_title!=null){
                    newsInfo_title_2=newsInfo_title;
                }
                if(newsInfo_url!=null){
                    newsInfo_url_2=newsInfo_url;
                }
                if(newsInfo_text!=null){
                    newsInfo_text_2=newsInfo_text;
                }
                if(newsInfo_source!=null){
                    newsInfo_source_2=newsInfo_source;
                }
                if(newsInfo_date!=null){
                    newsInfo_date_2=newsInfo_date;
                }
                if(newsInfo_image_desc!=null){
                    newsInfo_image_desc_2=newsInfo_image_desc;
                }
                ////newsInfo_title, newsInfo_url,newsInfo_text, newsInfo_source,newsInfo_date,newsInfo_image_desc,

                var item = {title:newsInfo_title_2,image: target_upload_name ,url: newsInfo_url_2 ,text:newsInfo_text_2,source:newsInfo_source_2,date:newsInfo_date_2,image_desc:newsInfo_image_desc_2};
                result.news_content.push(item);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    //}
}
function pushPeople(_id,  p_desc,p_title, target_upload_name, callback) {
    //if (flag == 'menu') {
        People.getPeople(new ObjectID(_id), function (err, result) {
            if (result) {
                var item = {title:p_title,image: target_upload_name, desc:p_desc };
                result.simple_introduce.push(item);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    //}
}
function pushImg(_id, type, target_upload_name, callback) {
    if (type == '1') {
        Restaurant.getRestaurant(new ObjectID(_id), function (err, result) {
            if (result) {
                result.image.push(target_upload_name);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    } else if (type == '2') {
        Shopping.getShopping(new ObjectID(_id), function (err, result) {
            if (result) {
                result.image.push(target_upload_name);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    } else {
        Entertainment.getEntertainment(new ObjectID(_id), function (err, result) {
            if (result) {
                result.image.push(target_upload_name);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    }
}

function pullMenu(_id, type, target_upload_name, callback) {
    Restaurant.getRestaurant(new ObjectID(_id), function (err, result) {
        if (result) {
            var tmp = result.menu
            i = tmp.length
            pic = -1;
            while (i--) {
                if (tmp[i].cover_image == target_upload_name) {
                    pic = i;
                }
            }
            if (pic != -1) {
                result.menu.pull(result.menu[pic]);
            }
            result.save(function (err) {
                callback(err, result);
            });
        } else {
            callback(err, result);
        }
    });
}
function pull_Pgc_image_desc(_id, type, target_upload_name, callback) {
    Pgc.getPgc(new ObjectID(_id), function (err, result) {
        if (result) {
            var tmp = result.pgc_images_desc;
            i = tmp.length
            pic = -1;
            while (i--) {
                if (tmp[i].section_image == target_upload_name) {
                    pic = i;
                }
            }
            if (pic != -1) {
                result.pgc_images_desc.pull(result.pgc_images_desc[pic]);
            }
            result.save(function (err) {
                callback(err, result);
            });
        } else {
            callback(err, result);
        }
    });
}
function pull_News_Cms_image_desc(_id,  target_upload_name, callback) {
    News.getNews_cms(new ObjectID(_id), function (err, result) {
        if (result) {
            var tmp = result.news_content;
            i = tmp.length
            pic = -1;
            while (i--) {
                if (tmp[i].image == target_upload_name) {
                    pic = i;
                }
            }
            if (pic != -1) {
                result.news_content.pull(result.news_content[pic]);
            }
            result.save(function (err) {
                callback(err, result);
            });
        } else {
            callback(err, result);
        }
    });
}
function pullActivity_image(_id, type, target_upload_name, callback) {
    Activity.getActivity(new ObjectID(_id), function (err, result) {
        if (result) {
            var tmp = result.images_desc;
            i = tmp.length
            pic = -1;
            while (i--) {
                if (tmp[i].image_id == target_upload_name) {
                    pic = i;
                }
            }
            if (pic != -1) {
                result.images_desc.pull(result.images_desc[pic]);
            }
            result.save(function (err) {
                callback(err, result);
            });
        } else {
            callback(err, result);
        }
    });
}
function pullMenu_people(_id, type, target_upload_name, callback) {
    People.getPeople(new ObjectID(_id), function (err, result) {
        if (result) {
            var tmp = result.simple_introduce
            i = tmp.length
            pic = -1;
            while (i--) {
                if (tmp[i].image == target_upload_name) {
                    pic = i;
                }
            }
            if (pic != -1) {
                result.simple_introduce.pull(result.simple_introduce[pic]);
            }
            result.save(function (err) {
                callback(err, result);
            });
        } else {
            callback(err, result);
        }
    });
}
function pullImg(_id, type, target_upload_name, callback) {
    if (type == '1') {
        Restaurant.getRestaurant(new ObjectID(_id), function (err, result) {
            if (result) {

                result.image.pull(target_upload_name);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    } else if (type == '2') {
        Shopping.getShopping(new ObjectID(_id), function (err, result) {
            if (result) {
                result.image.pull(target_upload_name);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    } else {
        Entertainment.getEntertainment(new ObjectID(_id), function (err, result) {
            if (result) {
                result.image.pull(target_upload_name);
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    }
}

function setCoverImg(_id, type, cover_image, callback) {
    if (type == '1') {
        Restaurant.getRestaurant(new ObjectID(_id), function (err, result) {
            if (result) {
                result.cover_image = cover_image;
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    } else if (type == '2') {
        Shopping.getShopping(new ObjectID(_id), function (err, result) {
            if (result) {
                result.cover_image = cover_image;
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    } else {
        Entertainment.getEntertainment(new ObjectID(_id), function (err, result) {
            if (result) {
                result.cover_image = cover_image;
                result.save(function (err) {
                    callback(err, result);
                });
            } else {
                callback(err, result);
            }
        });
    }
}

