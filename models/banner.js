var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//广告信息
var BannerSchema = new Schema({
    type: {type: String},
    ios_url: {type: String},
    android_url: {type: String},
    iPhone6plus_image : {type: String},
});
mongoose.model('Banner', BannerSchema);


