var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//品牌信息
var BrandSchema = new Schema({
    title: {type: String},
    type: {type: String},
    advice: {type: String},
    cover_image: {type: String},
    //images: {type: Array},
    desc: {type: String}
});
mongoose.model('Brand', BrandSchema);


