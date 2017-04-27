var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//动态推送消息
var RecommendInfoSchema = new Schema({
    city_id: {type: String},
    city_name: {type: String},
    recommend_type: {type: String},//推荐类型的描述（0：基于时间的推送、1：基于地理位置的推送)
    //基于时间的推送
    move_type: {type: String},//移送类型：(1-时间敏感型；2-非时间敏感型）
    type: {type: String},//景点POI；餐厅POI；商场POI；商圈POI； 活动；PGC；新闻；城市简介
    recommend_desc: {type: String},//推荐描述
    recommend_start_date: {type: String},//推荐开始日期
    recommend_start_date_1: {type: String},
    recommend_end_date_1: {type: String},
    recommend_poi_lat: {type: String},//维度
    recommend_poi_lon: {type: String},//经度
    recommend_end_date: {type: String},//推荐结束日期
    recommend_start_time: {type: String},//推荐开始时间
    recommend_end_time: {type: String},//推荐结束时间
    recommend_content: {},//推荐内容：ID、名称、推荐理由（30字）
    //基于地理位置的推送
    recommend_radius: {type: String},//推送半径
    recommend_poi_id: {type: String},//poi的ID
    recommend_poi_position: {type: String},//中心点
    recommend_poi_name: {type: String},//poi的名称
    recommend_address_content: {}//推荐内容：类型（景点POI；餐厅POI；商场POI；商圈POI； 活动；PGC；新闻；城市简介）、ID、名称、推荐理由（30字）
}, {
    collection : 'recommendinfo'
});
mongoose.model('RecommendInfo', RecommendInfoSchema);





/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//动态推送消息
var RecommendInfoSchema = new Schema({
    city_id: {type: String},
    city_name: {type: String},
    recommend_type: {type: String},//推荐类型的描述（0：基于时间的推送、1：基于地理位置的推送)
    //基于时间的推送
    move_type: {type: String},//移送类型：(1-时间敏感型；2-非时间敏感型）
    type: {type: String},//景点POI；餐厅POI；商场POI；商圈POI； 活动；PGC；新闻；城市简介
    recommend_desc: {type: String},//推荐描述
    recommend_start_date: {type: String},//推荐开始日期
    recommend_end_date: {type: String},//推荐结束日期
    recommend_start_time: {type: String},//推荐开始时间
    recommend_end_time: {type: String},//推荐结束时间
    recommend_content: {type: Array},//推荐内容：ID、名称、推荐理由（30字）
    //基于地理位置的推送
    recommend_radius: {type: String},//推送半径
    recommend_poi_id: {type: String},//poi的ID
    recommend_poi_name: {type: String},//poi的名称
    recommend_address_content: {type: Array},//推荐内容：类型（景点POI；餐厅POI；商场POI；商圈POI； 活动；PGC；新闻；城市简介）、ID、名称、推荐理由（30字）
});
mongoose.model('RecommendInfo', RecommendInfoSchema);


*/
