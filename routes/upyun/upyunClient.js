var UPYun = require('./upyun').UPYun;
// Test code

// 初始化空间
var upyun = new UPYun("weegotest", "upload", "weego2013");

function upToYun(src_path_name,target_path_name,callback){
	var fs =  require('fs');
	var fileContent = fs.readFileSync(src_path_name);
	upyun.writeFile(target_path_name, fileContent, false, function(err, data){
	    if (err) {
	       callback(err);
	    }else
	    	callback(null,data);
	});
}

exports.upToYunn = function (src_path_name, target_path_name, callback) {
    var fs = require('fs');
    var fileContent = fs.readFileSync(src_path_name);
    upyun.writeFile(target_path_name, fileContent, false, function (err, data) {
        if (err) {
            callback(err);
        } else
            callback(null, data);
    });
}

function delFromYun(target_path_name,callback){
	upyun.deleteFile(target_path_name, function(err,data){
		if(err)
			console.log(err);
		else
			callback(data);
	});
}

exports.upHotelToYun = function(fileName,callback){

	var src_path_name0 = global.imgpathDO + fileName;
	var target_path_name0 = global.hotelpathDO + fileName;
	var src_path_name1 = global.imgpathD1 + fileName;
	var target_path_name1 = global.hotelpathD1 + fileName;
	var src_path_name2 = global.imgpathD2 + fileName;
	var target_path_name2 = global.hotelpathD2 + fileName;
	var src_path_name3 = global.imgpathD3 + fileName;
	var target_path_name3 = global.hotelpathD3 + fileName;
	var src_path_name4 = global.imgpathD4 + fileName;
	var target_path_name4 = global.hotelpathD4 + fileName;

	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name1,target_path_name1,function(err,data1){
			if(err) throw err;
			upToYun(src_path_name2,target_path_name2,function(err,data2){
				if(err) throw err;
				upToYun(src_path_name3,target_path_name3,function(err,data3){
					if(err) throw err;
					upToYun(src_path_name4,target_path_name4,function(err,data4){
						if(err) throw err;
						callback(null,data4);
					});
				});
			});
		});
	});
};

exports.delHotelFromYun = function(fileName,callback){
	var target_path_name0 = global.hotelpathDO + fileName;
	var target_path_name1 = global.hotelpathD1 + fileName;
	var target_path_name2 = global.hotelpathD2 + fileName;
	var target_path_name3 = global.hotelpathD3 + fileName;
	var target_path_name4 = global.hotelpathD4 + fileName;
	delFromYun(target_path_name0, function(err,data0){
		if(err) throw err;
		delFromYun(target_path_name1, function(err,data1){
			if(err) throw err;
			delFromYun(target_path_name2, function(err,data2){
				if(err) throw err;
				delFromYun(target_path_name3, function(err,data3){
					if(err) throw err;
					delFromYun(target_path_name4, function(err,data4){
						if(err) throw err;
						callback(null,data4);
					});
				});
			});
		});
	});
};
exports.upActivityToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathactO + fileName;
	var target_path_name0 = global.actpathAO + fileName;
	var target_path_name1 = global.actpathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upBrandToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathBrO + fileName;
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upNews_cmsToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathBrO + fileName;
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upRecommendInfoToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathBrO + fileName;
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upBannerToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathBrO + fileName;
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upPeopleToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathBrO + fileName;
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upPgcToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathBrO + fileName;
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upPgcOriginImageToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathBrO + fileName;
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upCityToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathCCO + fileName;
	var target_path_name0 = global.citypathAO + fileName;
	var target_path_name1 = global.citypathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upCityCoverImageToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathC2 + fileName;
	var target_path_name0 = global.citypathC2 + fileName;
	var target_path_name1 = global.citypathCC2 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.delActivityFromYun1=function(fileName,callback){
	var target_path_name0 = global.actpathAO + fileName;
	var target_path_name1 = global.actpathA1 + fileName;
	delFromYun(target_path_name0, function(err,data0) {
		if (err) throw err;
		delFromYun(target_path_name1, function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.delBrandFromYun1=function(fileName,callback){
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	delFromYun(target_path_name0, function(err,data0) {
		if (err) throw err;
		delFromYun(target_path_name1, function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.delNews_cmsFromYun1=function(fileName,callback){
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	delFromYun(target_path_name0, function(err,data0) {
		if (err) throw err;
		delFromYun(target_path_name1, function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.delBannerFromYun1=function(fileName,callback){
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	delFromYun(target_path_name0, function(err,data0) {
		if (err) throw err;
		delFromYun(target_path_name1, function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.delPeopleFromYun1=function(fileName,callback){
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	delFromYun(target_path_name0, function(err,data0) {
		if (err) throw err;
		delFromYun(target_path_name1, function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.delPgcFromYun1=function(fileName,callback){
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	delFromYun(target_path_name0, function(err,data0) {
		if (err) throw err;
		delFromYun(target_path_name1, function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.delPgcOriginFromYun1=function(fileName,callback){
	var target_path_name0 = global.brandpathAO + fileName;
	var target_path_name1 = global.brandpathA1 + fileName;
	delFromYun(target_path_name0, function(err,data0) {
		if (err) throw err;
		delFromYun(target_path_name1, function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.delCityFromYun1=function(fileName,callback){
	var target_path_name0 = global.citypathAO + fileName;
	var target_path_name1 = global.citypathA1 + fileName;
	delFromYun(target_path_name0, function(err,data0) {
		if (err) throw err;
		delFromYun(target_path_name1, function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upAttractionToYun1=function(fileName,callback){
	var src_path_name0 = global.imgpathAO + fileName;
	var target_path_name0 = global.attpathAO + fileName;
	var target_path_name1 = global.attpathA1 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);
	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name0,target_path_name1,function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.upAttractionToYun = function(fileName,callback){
	var src_path_name0 = global.imgpathAO + fileName;
	var target_path_name0 = global.attpathAO + fileName;
	var src_path_name1 = global.imgpathA1 + fileName;
	var target_path_name1 = global.attpathA1 + fileName;
	var src_path_name2 = global.imgpathA2 + fileName;
	var target_path_name2 = global.attpathA2 + fileName;
	var src_path_name3 = global.imgpathA3 + fileName;
	var target_path_name3 = global.attpathA3 + fileName;
	var src_path_name4 = global.imgpathA4 + fileName;
	var target_path_name4 = global.attpathA4 + fileName;
	var src_path_name5 = global.imgpathA5 + fileName;
	var target_path_name5 = global.attpathA5 + fileName;
	console.log(src_path_name0);
	console.log(target_path_name0);

	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name1,target_path_name1,function(err,data1){
			if(err) throw err;
			upToYun(src_path_name2,target_path_name2,function(err,data2){
				if(err) throw err;
				upToYun(src_path_name3,target_path_name3,function(err,data3){
					if(err) throw err;
					upToYun(src_path_name4,target_path_name4,function(err,data4){
						if(err) throw err;
						upToYun(src_path_name5,target_path_name5,function(err,data5){
							if(err) throw err;
							callback(null,data5);
						});
					});
				});
			});
		});
	});
};
exports.delAttractionFromYun1 =function(fileName,callback){
	var target_path_name0 = global.attpathAO + fileName;
	var target_path_name1 = global.attpathA1 + fileName;
	delFromYun(target_path_name0, function(err,data0) {
		if (err) throw err;
		delFromYun(target_path_name1, function(err,data1) {
			if (err) throw err;
			callback(null, data1);
		});
	});
};
exports.delAttractionFromYun = function(fileName,callback){
	var target_path_name0 = global.attpathAO + fileName;
	var target_path_name1 = global.attpathA1 + fileName;
	var target_path_name2 = global.attpathA2 + fileName;
	var target_path_name3 = global.attpathA3 + fileName;
	var target_path_name4 = global.attpathA4 + fileName;
	var target_path_name5 = global.attpathA5 + fileName;
	delFromYun(target_path_name0, function(err,data0){
		if(err) throw err;
		delFromYun(target_path_name1, function(err,data1){
			if(err) throw err;
			delFromYun(target_path_name2, function(err,data2){
				if(err) throw err;
				delFromYun(target_path_name3, function(err,data3){
					if(err) throw err;
					delFromYun(target_path_name4, function(err,data4){
						if(err) throw err;
						delFromYun(target_path_name5, function(err,data5){
							if(err) throw err;
							callback(null,data5);
						});
					});
				});
			});
		});
	});
};
//这里没有citypathC1
exports.upCityToYun = function(fileName,callback){
	var src_path_name0 = global.imgpathCO + fileName;
	var target_path_name0 = global.citypathCO + fileName;
	var src_path_name2 = global.imgpathC2 + fileName;
	var target_path_name2 = global.citypathC2 + fileName;
	var src_path_name3 = global.imgpathC3 + fileName;
	var target_path_name3 = global.citypathC3 + fileName;

	upToYun(src_path_name0,target_path_name0,function(err,data0){
		if(err) throw err;
		upToYun(src_path_name2,target_path_name2,function(err,data1){
			if(err) throw err;
			upToYun(src_path_name3,target_path_name3,function(err,data2){
				if(err) throw err;
				callback(null,data2);
			});
		});
	});
};
//这里没有citypathC1
exports.delCityFromYun = function(fileName,callback){
	var target_path_name0 = global.citypathCO + fileName;
	var target_path_name2 = global.citypathC2 + fileName;
	var target_path_name3 = global.citypathC3 + fileName;
	delFromYun(target_path_name0, function(err,data0){
		if(err) throw err;
		delFromYun(target_path_name2, function(err,data1){
			if(err) throw err;
			delFromYun(target_path_name3, function(err,data2){
				if(err) throw err;
				callback(null,data2);
			});
		});
	});
};

//citypathC1
exports.upCityBgToYun = function(fileName,callback){
	var src_path_name1 = global.imgpathC1 + fileName;
	var target_path_name1 = global.citypathC1 + fileName;
	upToYun(src_path_name1,target_path_name1,function(err,data0){
		if(err) throw err;
		callback(null,data0);
	});
};
//citypathC1
exports.delCityBgFromYun = function(fileName,callback){
	var target_path_name1 = global.citypathC1 + fileName;
	delFromYun(target_path_name1, function(err,data0){
		if(err) throw err;
		callback(null,data0);
	});
};

exports.upActivity_images_ToYun = function(type,fileName,callback){
	var src_path_name0 = getSrcPathByType(type) + fileName;
	var target_path_name0 = getTargetPathByType(type) + fileName;

    upToYun(src_path_name0, target_path_name0, function (err, data0) {
        if (err) throw err;
        if (type == '1') {
            upToYun(global.imgpathEO + fileName, global.lifepathEOios + fileName, function (err, data) {
                if (err) console.log(err);
                callback(null, data);
            })
		} else if (type == '2') {
			upToYun(global.imgpathFO + fileName, global.lifepathFOios + fileName, function (err, data) {
				if (err) console.log(err);
				callback(null, data);
			})
		} else{
			callback(null, data0);
		}
    });
};
exports.upLifeToYun = function(type,fileName,callback){
	var src_path_name0 = getSrcPathByType(type) + fileName;
	var target_path_name0 = getTargetPathByType(type) + fileName;

    upToYun(src_path_name0, target_path_name0, function (err, data0) {
        if (err) throw err;
        if (type == '1') {
            upToYun(global.imgpathEO + fileName, global.lifepathEOios + fileName, function (err, data) {
                if (err) console.log(err);
                callback(null, data);
            })
		} else if (type == '2') {
			upToYun(global.imgpathFO + fileName, global.lifepathFOios + fileName, function (err, data) {
				if (err) console.log(err);
				callback(null, data);
			})
		} else{
			callback(null, data0);
		}
    });
};

exports.upPgc_images_ToYun = function(type,fileName,callback){
	var src_path_name0 = getSrcPathByType(type) + fileName;
	var target_path_name0 = getTargetPathByType(type) + fileName;

    upToYun(src_path_name0, target_path_name0, function (err, data0) {
        if (err) throw err;
        if (type == '1') {
            upToYun(global.imgpathEO + fileName, global.lifepathEOios + fileName, function (err, data) {
                if (err) console.log(err);
                callback(null, data);
            })
		} else if (type == '2') {
			upToYun(global.imgpathFO + fileName, global.lifepathFOios + fileName, function (err, data) {
				if (err) console.log(err);
				callback(null, data);
			})
		} else{
			callback(null, data0);
		}
    });
};

exports.upNews_CMS_images_ToYun = function(type,fileName,callback){
	var src_path_name0 = getSrcPathByType(type) + fileName;
	var target_path_name0 = getTargetPathByType(type) + fileName;

    upToYun(src_path_name0, target_path_name0, function (err, data0) {
        if (err) throw err;
        if (type == '1') {
            upToYun(global.imgpathEO + fileName, global.lifepathEOios + fileName, function (err, data) {
                if (err) console.log(err);
                callback(null, data);
            })
		} else if (type == '2') {
			upToYun(global.imgpathFO + fileName, global.lifepathFOios + fileName, function (err, data) {
				if (err) console.log(err);
				callback(null, data);
			})
		} else{
			callback(null, data0);
		}
    });
};

exports.delLifeFromYun = function(type,fileName,callback){
	var target_path_name0 = getTargetPathByType(type) + fileName;

	delFromYun(target_path_name0, function(err,data0){
		if(err) throw err;
		if (type == '1') {
			delFromYun(global.lifepathEOios + fileName, function (err, data) {
				if (err) console.log(err);
				callback(null, data);
			})
		}
	});
};

exports.upAreaToYun = function(fileName, callback){
	var src_path = global.imgpathSO + fileName;
	var target_path0 = global.lifepathAO + fileName;
	var target_path1 = global.lifepathAOios + fileName;
	upToYun(src_path, target_path0, function(err, data0){
		if(err) throw err;
		upToYun(src_path, target_path1, function(err, data) {
			if(err) throw err;
			callback(null, data);
		})
	})
}

exports.delAreaFromYun = function(fileName, callback){
	var target_path0 = global.lifepathAO + fileName;
	var target_path1 = global.lifepathAOios + fileName;
	delFromYun(target_path0, function(err, data0){
		if(err) throw err;
		delFromYun(target_path1, function(err, data) {
			if(err) throw err;
			callback(null, data);
		})
	})
}

function getSrcPathByType (type){
    if(type=='1')
        return global.imgpathEO;
    else if(type=='2')
        return global.imgpathFO;
    else
        return global.imgpathGO;
}
function getTargetPathByType (type){
    if(type=='1')
        return global.lifepathEO;
    else if(type=='2')
        return global.lifepathFO;
    else
        return global.lifepathGO;
}
