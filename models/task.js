var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //任务
 //10:待办，50，已完成。
var TaskSchema = new Schema({
	city_id: { type: ObjectId ,index: true },
	city_name: { type: String },
	editor_id: { type: ObjectId ,index: true },
	editor_name: {type: String},
	name: { type: String },
	create_at: { type: Date, default: Date.now },
	days:{ type:Number},
	attraction_num:{ type:Number, default: 0},
	restaurant_num:{ type:Number, default: 0},
	shopping_num:{ type:Number, default: 0},
	entertainment_num:{ type:Number, default: 0},
	total:{type:Number, default: 0},
	finish_rate:{type:Number,default:0},
	desc:{type:String},
	status:{ type:Number,default:10}
});

mongoose.model('Task', TaskSchema);
