var async = require('async');

/**
 * Stripe Customer
 */
var customers = require(__base + '/app/lib/customers');

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

function findUserAccount(req, callback) {
	Account.findOne({ user: req.user._id }, function onCheckExists(err, exists) {
		if (err) return callback(err);
		if (exists) return callback(new Error('An account already exists'));

		var account = new Account(req.body);

		return callback(null, req, account);
	});
}

function createCustomerAccount(req, account, callback) {
	customers.create(req.user, function onCustomerCreate(err, customer) {
		if (err) return callback(err);

		account.customer_id = customer.id;

		return callback(null, req, account);
	});
}

function uploadImage(req, account, callback) {
	if (!req.file) return callback(null, req, account);

	upload({
		req: req,
		model: account,
		folder: folder
	}, function onImageUpload(err, results) {
		if (err) return callback(err);

		account.image = results;

		return callback(null, req, account);
	});
}

function saveAccount(req, account, callback) {
	account.user = req.user._id;

	account.save(function onAccountSave(err) {
		if (err) return callback(err);
		return callback(null, account);
	});
}

/**
 * Create an account
 */
var create = function onCreate(req, res, next) {
	async.waterfall([
		async.apply(findUserAccount, req),
		createCustomerAccount,
		uploadImage,
		saveAccount
	], function onComplete(err, results) {
		console.log(err, results);
		if (err) return next(err);
		return res.status(200).json(results);
	});
};

module.exports = create;
