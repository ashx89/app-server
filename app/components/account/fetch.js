/**
 * Model
 */
var Account = require(__base + '/app/models/account');

/**
 * Fetch a account
 */
var fetch = function onFetch(req, res, next) {
	Account.findOne({ user: req.user._id }, function onFind(err, doc) {
		if (err) return next(err);
		if (!doc) return next(new Error('Account does not exist'));

		return res.status(200).json(doc);
	});
};

module.exports = fetch;
