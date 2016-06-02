var jwt = require('jsonwebtoken');

var authentication = {
	register: function (req, res, next) {
		res.sendStatus(200);
	}
};

module.exports = authentication;
