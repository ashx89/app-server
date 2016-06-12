/**
 * Model
 */
var Meal = require(__base + '/app/models/meal');

/**
 * Delete a meal item
 */
var remove = function onDelete(req, res, next) {
	var id = req.params.id;

	var query = { _id: id, user: req.user._id };

	Meal.remove(query, function onRemove(err, result) {
		if (err) return next(err);
		return res.status(200).json(result);
	});
};

module.exports = remove;
