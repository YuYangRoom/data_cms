var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//城市推荐时间分段表
var RecommendTimeSchema = new Schema({
    time_interval: Array,//开始时间:start_time, 结束时间:end_time,名称:title
    city: {
        _id: String,
        cityname: String
    }//城市
}, {
    collection: 'recommendTime'
});

mongoose.model('RecommendTime', RecommendTimeSchema);
