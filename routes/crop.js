/**
 * Created with JetBrains WebStorm.
 * User: Steve
 * Date: 13-7-17
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */
require('../config/Config');
var im = require('imagemagick');
im.identify.path = global.imIdentifyPath;
im.convert.path = global.imConvertPath;

im.crop({srcPath:'home/jiangli/opq.jpg',dstPath:'home/jiangli/new_2345.jpeg',  width:290,height:177,quality:1,gravity:'Center' }, function (err, metadata) {
    if (err) throw err;

});