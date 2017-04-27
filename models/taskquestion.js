var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //任务
var TaskquestionSchema = new Schema({
	asker_id: { type: ObjectId },
	asker_name: { type: String },
	answer_id: { type: ObjectId ,index: true },
	answer_name: { type: String },
	content: { type: String},
	create_at: { type: Date, default: Date.now },
	is_closed:{ type:Boolean,default:false}
});

mongoose.model('Taskquestion', TaskquestionSchema);
