var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
 //申请审核条目。
 //type: city, attraction, restaurant, shoparea, shopping
 //log_type : 0,新建，1修改。
 //status: 0，尚未递交审核，1，审核中，2，审核通过，-1，审核不通过。

var AuditingSchema = new Schema({
	city_id			: { type: ObjectId ,index: true },
	countryname 	: { type: String },
	city_name		: { type: String },
	task_id			: { type: ObjectId ,index: true },
	task_name		: { type: String },
	editor_id		: { type: ObjectId ,index: true },
	item_id			: { type: ObjectId },
	type 			: { type: String },
	log_type		: { type: String },
	name 			: { type: String },
	status			: { type: String , default: '0'},
	editorname		: { type: String },
	editdate		: { type: String },
	auditorname		: { type: String },
	auditdate		: { type: String },
	auditcomment	: { type: String },
	en_info			: {
		status			: { type: String , default: '0'},
		editorname		: { type: String },
		editdate		: { type: String },
		auditorname		: { type: String },
		auditdate		: { type: String },
		auditcomment	: { type: String },
	}
});

mongoose.model('Auditing', AuditingSchema); 
 