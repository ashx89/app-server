var path = require('path');
var s3 = require('app-util').s3();

/**
 * Image Upload
 */
var upload = require(__base + '/app/lib/upload');

/**
 * Folder to upload resource to
 */
var folder = 'users/';

/**
 * Model
 */
var Meal = require(__base + '/app/models/meal');

/**
 * Save the updated model
 * @param {object} meal. New model created
 */
function databaseOperation(meal, req, res, next) {
	meal.user = req.user._id;

	meal.save(function onMealSave(err) {
		if (err) return next(err);
		return res.status(200).json(meal);
	});
}

/**
 * Create a meal item
 */
var create = function onCreate(req, res, next) {
	var meal = new Meal(req.body);

	if (req.file) {
		upload({
			req: req,
			model: meal,
			folder: folder
		}, function onImageUpload(err, result) {
			if (err) return next(err);

			meal.image = result;

			return databaseOperation(meal, req, res, next);
		});
	} else {
		return databaseOperation(meal, req, res, next);
	}
};

module.exports = create;
