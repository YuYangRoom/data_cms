var models = require('../models');
var Label = models.Label;
var ObjectID = require('mongodb').ObjectID;

exports.findOneById = function(id, callback){
	Label.findOne({_id:new ObjectID(id)},callback);
}