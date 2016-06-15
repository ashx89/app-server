var _ = require('underscore');

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
	account = _.extend(account, req.body);

	account.save(function onAccountSave(err) {
		if (err) return next(err);
		return res.status(200).json(account);
	});
}

/**
 * Update an account
 */
var update = function onUpdate(req, res, next) {
	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		if (err) return next(err);
		if (!account) return next(new Error('Account does not exist'));

		if (req.file) {
			upload({
				req: req,
				model: account,
				folder: folder
			}, function onImageUpload(err, result) {
				if (err) return next(err);

				req.body.image = result;
				return databaseOperation(account, req, res, next);
			});
		} else {
			return databaseOperation(account, req, res, next);
		}
	});
};

module.exports = update;
