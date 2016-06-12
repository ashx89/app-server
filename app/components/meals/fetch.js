var _ = require('underscore');

/**
 * Model
 */
var Meal = require(__base + '/app/models/meal');

/**
 * Fetch a meal
 */
var fetch = function onFetch(req, res, next) {
	var id = req.params.id;

	var query = { user: req.user._id };

	if (id) query = _.extend(query, {_id: id});
	
	Meal.find(query, function onFind(err, doc) {
		if (err) return next(err);
		if (!doc || !doc.length) return next(new Error('No meals have been created'));

		return (doc.length === 1) ? res.status(200).json(doc[0]) : res.status(200).json(doc);
	});
};

module.exports = fetch;
