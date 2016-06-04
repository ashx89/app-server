/**
 * User Model
 * Account Model
 */
var Account = require(__base + '/app/models/account');

/**
 * Create an account
 */
var create = function onCreate(req, res, next) {
	var account = new Account(req.body);

	account.user = req.user._id;

	account.save(function onAccountSave(err) {
		if (err) return next(err);
		return res.status(200).json(account);
	});
};

module.exports = create;
