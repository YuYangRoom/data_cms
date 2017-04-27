var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//h5分享信息
var Event_cmsSchema = new Schema({
    city: {
        _id: String,
        name: String
    },
    time:{
        sign_up:String,//报名开始时间
        active:String//活动开始时间
    },
    state:{},
    order:{type:String},//排序
    name:{type:String},//活动名称
    thumbnail_image: {type: String},//缩略图
    detail_image: {type: String},//详情图
    sign_up_image: {type: String},//报名信息图
    partner_image: {type: String},//合作伙伴信息图
    type: {type: String},//分类的信息
    desc_type: {type: String}//分类的描述
}, {collection: 'events'});
mongoose.model('Event_cms', Event_cmsSchema);


