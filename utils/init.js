var Label = require('../routes/label');
var Life = require('../routes/life');
exports.init = function(){
	Label.initFirstLevelLabel();
	Life.initCategory();
};
