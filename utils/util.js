
var fs = require('fs');

exports.format_date = function (date, friendly) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (friendly) {
    var now = new Date();
    var mseconds = -(date.getTime() - now.getTime());
    var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }

  //month = ((month < 10) ? '0' : '') + month;
  //day = ((day < 10) ? '0' : '') + day;
  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0': '') + second;

  var thisYear = new Date().getFullYear();
  year = (thisYear === year) ? '' : (year + '-');
  return year + month + '-' + day + ' ' + hour + ':' + minute;
};

exports.isInt = function(obj){
  if(obj){
    //必需是整数
    var reg = /^(-|\+)?\d+$/ ;
    return reg.test(obj);
  }else
    return false;
};

exports.isInArray = function(obj,arrObj){
  if(arrObj instanceof Array){
    for(var i=0;i<arrObj.length;i++){
      if(arrObj[i] == obj)
        return true;
    }
    return false;
  }else
    return false;
};

exports.isNull = function(str){
    if(str==null || str=='' || str==undefined || str=='undefined')
        return true;
    else{
        return false;
    }
};

//capitalize string
exports.cap = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.listFolder = function (options, cb) {
  var opt = options || {},
    path = opt.path;

  if (!path) throw new Error("path is a mandatory parameter");

  if (opt.async) {
    console.log('async version not yet implemented...');
    return [];
  }

  var files = fs.readdirSync(path).filter(function (file) {
    var excluded = opt.excludes && opt.excludes.some(function (ptn) {
      if (ptn instanceof RegExp) {
        return ptn.test(file);
      } else {
        return file == ptn;
      }
    });
    if (excluded) return false;

    var stat = fs.statSync(path + '/' + file);

    if (opt.isFile) {
      if (!stat.isFile()) return false;
    }
    if (opt.isDirectory) {
      if (!stat.isDirectory()) return false;
    }
    return true;
  });
  
  files.map(cb);
}