var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//城市标签，主标签masterlabel，子标签，sublabel

var LabelSchema = new Schema({
	_id			: ObjectId,
	classname 	: String,
	createFlag 	: String,
	label 		: String,
	level 		: String,
	subLabel 	: Array
},{
	collection  : 'label' 
});

mongoose.model('Label', LabelSchema);