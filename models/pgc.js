var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//PGC信息
var PgcSchema = new Schema({
    title: {type: String},//标题
    pgc_title: {type: String},//区域名称
    pgc_tags: {type: String},//标签
    cover_image: {type: String},//封面图片
    type: {type: String},//文章类型
    start_time: String,//开始日期
    end_time: String,//结束日期
    c_start_time: String,//开始日期
    c_end_time: String,//结束日期
    //city_type:String,//城市类型
    pgc_city:
    {
       _id:String ,
       cityname:String
    },//城市
    original: {
        url: String,
        source: String,
        image: String,
        desc: String,
        author: String
    },//第三方文章 type：3, 每个pgc只有一个
    pgc_country: {type: String},//国家
    content: {type: String},//文章内容
    introducation: {type: String},//导语
    pgc_poi: {type: Array}, //pois
    pgc_images_desc: {type: Array}, //pgc图文描述
    pgc_people: {
        _id: String,
        name: String
    }//json格式{_id:'',name:''}
});
mongoose.model('Pgc', PgcSchema);


