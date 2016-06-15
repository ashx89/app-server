/**
 * Image Upload
 */
var upload = require(__base + '/app/lib/upload');

/**
 * Folder to upload resource to
 */
var folder = 'accounts/';

/**
 * Model
 */
var Account = require(__base + '/app/models/account');

/**
 * Save the updated model
 * @param {object} account. Data fetched from the database
 */
function databaseOperation(account, req, res, next) {
	account.user = req.user._id;

	account.save(function onAccountSave(err) {
		if (err) return next(err);
		return res.status(200).json(account);
	});
}

/**
 * Create an account
 */
var create = function onCreate(req, res, next) {
	Account.findOne({ user: req.user._id }, function onCheckExists(err, exists) {
		if (err) return next(err);
		if (exists) return next(new Error('An account already exists'));

		var account = new Account(req.body);

		if (req.file) {
			upload({
				req: req,
				model: account,
				folder: folder
			}, function onImageUpload(err, result) {
				if (err) return next(err);

				account.image = result;

				return databaseOperation(account, req, res, next);
			});
		} else {
			return databaseOperation(account, req, res, next);
		}
	});
};

module.exports = create;
