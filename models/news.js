var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var NewsSchema = new Schema({
    last_modify_time: String,
    type: String,
    lead: String,
    image: String,
    lead_text: String,
    news_content:Array
}, {
    collection: 'news'
});

mongoose.model('News', NewsSchema);
