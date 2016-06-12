var _ = require('underscore');

/**
 * Model
 */
var Account = require(__base + '/app/models/account');

/**
 * Update an account
 */
var update = function onUpdate(req, res, next) {
	var account = req.body;

	Account.findOne({ _id: req.user._id }, function onFind(err, doc) {
		if (err) return next(err);
		if (!doc) return next(new Error('Account does not exist'));

		account = _.extend(doc, account);

		account.save(function onAccountSave(err) {
			if (err) return next(err);
			return res.status(200).json(account);
		});
	});
};

module.exports = update;
