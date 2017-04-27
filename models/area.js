var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//大类
//餐馆 非洲菜，美洲菜等。
//购物 种类，衣服，男装，女装，裤子，奢侈品，化妆品，等等。
//游玩 种类，游泳池、SPA水疗馆、歌舞厅、KTV、桌球房、保龄球馆、棋牌室、网球场
//type 1:餐馆，2：购物，3：游玩。
var AreaSchema = new Schema({
    city_id: {type: ObjectId, index: true},
    city_name: {type: String},
    brief_introduce: {type: String},
    place_id: {type: String},
    comments_from: {type: String},
    area_name: {type: String},
    area_enname: {type: String},
    short_introduce: {type: String},
    area_introduce: {type: String},
    address: {type: String},
    open_time: {type: String},
    latitude: {type: String},
    longitude: {type: String},
    image: {type: Array},
    periods: {type: Array},
    comments: {type: Array},
    cover_image: {type: String, default: '5327c20da71a2a9415000001.jpg'},
    traffic: {type: String},
    tips: {type: String},
    tags: {type: Array},
    tel: {type: String},
    shoptags: {type: Array},
    website: {type: String},
    status: String,
    editorname: String,
    editdate: String,
    auditorname: String,
    auditdate: String,
    en_info: {
        introduce: String,
        address: String
    }
});

mongoose.model('Area', AreaSchema);
