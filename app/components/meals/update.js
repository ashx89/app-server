var _ = require('underscore');
var path = require('path');
var s3 = require('app-util').s3();

var bucket = 'users/';

/**
 * Model
 */
var Meal = require(__base + '/app/models/meal');

/**
 * Update a meal item
 */
var update = function onUpdate(req, res, next) {
	var id = req.params.id;
	var meal = req.body;

	if (req.file) {
		var ext = path.extname(req.file.originalname);

		var params = {
			ACL: 'public-read',
			Key: bucket + req.user._id + '/meals/' + id + ext,
			ContentType: req.file.mimetype,
		};

		meal.image = req.user.resource + 'meals/' + id + ext;

		s3.upload(params, req.file.buffer, function onS3Upload(err, result) {
			if (err) return next(err);
			meal.image = result.Location;
		});
	}

	Meal.findById(id, function onMealUpdate(err, item) {
		if (err) return next(err);
		if (!item) return next(new Error('No meal item found'));

		item = _.extend(item, meal);

		item.save(function onSave(err) {
			if (err) return next(err);
			return res.status(200).json(item);
		});
	});
};

module.exports = update;
