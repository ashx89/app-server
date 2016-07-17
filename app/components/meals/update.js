var _ = require('underscore');
var upload = require('app-util').upload;

/**
 * Model
 */
var Meal = require(__base + '/app/models/meal');

/**
 * Save the updated model
 * @param {object} meal. Data fetched from the database
 */
function databaseOperation(meal, req, res, next) {
	meal = _.extend(meal, req.body);

	meal.save(function onMealSave(err) {
		if (err) return next(err);
		return res.status(200).json(meal);
	});
}

/**
 * Update a meal item
 */
var update = function onUpdate(req, res, next) {
	var id = req.params.id;

	Meal.findOne({ _id: id, user: req.user._id }, function onMealUpdate(err, meal) {
		if (err) return next(err);
		if (!meal) return next(new Error('No meal item found'));

		if (req.file) {
			upload({
				req: req,
				model: meal,
				folder: 'meals'
			}, function onImageUpload(err, result) {
				if (err) return next(err);

				req.body.image = result;

				return databaseOperation(meal, req, res, next);
			});
		} else {
			return databaseOperation(meal, req, res, next);
		}
	});
};

module.exports = update;
