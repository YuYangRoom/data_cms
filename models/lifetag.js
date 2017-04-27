var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
//生活信息标签：例如：
//朋友聚餐 情侣约会 家庭聚会 可以刷卡 无线上网 随便吃吃 休闲小憩 免费停车 有下午茶 商务宴请  
//type 1:餐馆，2：购物，3：游玩。
var LifetagSchema = new Schema({
  type: { type: Number },
  name: { type: String }
});

mongoose.model('Lifetag', LifetagSchema);
