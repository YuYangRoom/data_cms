var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//人物信息
var PeopleSchema = new Schema({
    username: {type: String},//名字
    job_desc: {type: String},//职业描述
    short_introduce: {type: String},//一句话描述
    type: {type: String},//
    simple_introduce:{type:Array},
    //images:{type:Array},
/*    simple_introduce: {//人物简介
        title: String,
        desc: String,
        image: String
    },*/
    city_name: {
        _id: String,
        name: String
    },
    cover_image: {type: String},//封面图片
    head_image: {type: String}//人物头像
});
mongoose.model('People', PeopleSchema);


