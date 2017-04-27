var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
 //餐馆 各种菜肴种类，例如：意大利面，中式，。。
 //购物 种类，衣服，男装，女装，裤子，奢侈品，化妆品，等等。
 //游玩 种类，游泳池、SPA水疗馆、歌舞厅、KTV、桌球房、保龄球馆、棋牌室、网球场
 //type 1:餐馆，2：购物，3：游玩。
var CategorySchema = new Schema({
  type: { type: String },
  name: { type: String },
  en_name: { type: String }
});

mongoose.model('Category', CategorySchema);
