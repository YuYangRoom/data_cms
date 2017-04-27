var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/*
 *	Edituser model
 *	_id, username, password, type
 *	type:0-administrator,1-editor
 *  group: 0-chinese editors group, 1-english editors group
 */
 var EdituserSchema = new Schema({
 	_id			: { type: ObjectId },
 	username	: { type: String },
 	password	: { type: String },
 	type		: { type: Number },
 	group		: { type: Number }
 },{
 	collection: 'editUser'
 });

 EdituserSchema.statics = {
 	/**
	 * list adminstrator type is 0 
	 * list editors type is 1 and group is 0 (chinese editors)
	 * list editors type is 1 and group is 1 (english editors)
 	 */
 	getAdmin : function (opt, cb) {
 		this.find(opt, cb);
 	},
 	listChineseEditors : function (opt, cb) {
 		this.find(opt, cb);
 	},
 	listEnglishEditors : function (opt, cb) {
 		this.find(opt, cb);
 	}

 }

 mongoose.model('Edituser', EdituserSchema);