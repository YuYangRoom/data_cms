var models = require('../models');
var Edituser = models.Editor;

exports.getEditors = function(query, cb) {
	Edituser.find(query, cb);
}