var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//版本控制
var VersionSchema = new Schema({
    isShow : Boolean,//true显示、false不显示
    platform : String,
    version : String,
    operating : Number, // -1: 不用更新， 0：可选更新， 1：强制更新
    info : String,
    __v : Number,
   /* bootimage : {
        show_flag:Boolean,
        off_time:String,
        image:String,
        on_time:String
    }*/
}, {
    collection: 'versions'
});
mongoose.model('Version', VersionSchema);
/*
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var VersionSchema = new Schema({
    isShow : Boolean,//true显示、false不显示
    platform : String,
    version : String,
    operating : Number, // -1: 不用更新， 0：可选更新， 1：强制更新
    info : String,
    bootimage : Object
})
VersionSchema.queryMap = {
	getLabelById: function(q, value, done) {
		q.where({
			_id: value,
		});
		done(); //don't forget this callback
	}
}
VersionSchema.plugin(require('../lib/mongoosePlugin').queryPlugin);

mongoose.model('Version', VersionSchema);
*/
