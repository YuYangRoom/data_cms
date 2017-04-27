var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//type 0:景点，1:餐馆，2：购物，3：游玩。
var PathSchema = new Schema({
    city_id        : { type: ObjectId ,index: true },
    city_name      : { type: String },
    a_id           : { type: ObjectId ,index: true },
    a_type         : { type: String },
    b_id           : { type: ObjectId ,index: true },
    b_type         : { type: String },
    a_latitude     : { type: String },
    a_longitude    : { type: String },
    b_latitude     : { type: String },
    b_longitude    : { type: String },
    driver         : {
        taxifare   : { type: String },
        duration   : { type: String },
        distance   : { type: String },
        steps      : { type: Array }
    },
    bus            : {
        duration   : { type: String },
        distance   : { type: String },
        steps      : { type: Array }
    },
    walk           : {
        duration   : { type: String },
        distance   : { type: String },
        steps      : { type: Array }
    }
},{
    collection: 'pathsnew'
});

exports.Path = mongoose.model('Path', PathSchema);
