
exports.userRequired = function (req, res, next) {
  if (!req.session || !req.session.user) {
  	return res.redirect('/#login');
    // return res.send(403, '请登录系统!');
  }
  next();
};