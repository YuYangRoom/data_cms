var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//活动信息
var ActivitySchema = new Schema({
    title: {type: String},
    type: {type: String},
    atype: {type: String},
    cover_image: {type: String},
    open_time: {type: String},
    start_time: {type: String},
    end_time: {type: String},
    close_time: {type: String},
    address: {type: String},
    deaddress: {type: String},
    acttime: {type: String},
    acturl: {type: String},
    order_url: {type: String},
    longitude: {type: String},
    latitude: {type: String},
    price: {type: String},
    //images: {type: Array},
    images_desc: {type: Array},
    activity_city:
    {
        _id:String ,
        cityname:String
    },//城市
    desc: {type: String}
});
mongoose.model('Activity', ActivitySchema);


