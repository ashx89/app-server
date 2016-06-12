var path = require('path');
var s3 = require('app-util').s3();

var bucket = 'users/';

/**
 * Model
 */
var Meal = require(__base + '/app/models/meal');

/**
 * Create a meal item
 */
var create = function onCreate(req, res, next) {
	var meal = new Meal(req.body);

	meal.user = req.user._id;

	if (req.file) {
		var ext = path.extname(req.file.originalname);

		var params = {
			ACL: 'public-read',
			Key: bucket + req.user._id + '/meals/' + meal._id + ext,
			ContentType: req.file.mimetype,
		};

		meal.image = req.user.resource + 'meals/' + meal._id + ext;

		s3.upload(params, req.file.buffer, function onS3Upload(err, result) {
			if (err) return next(err);
			meal.image = result.Location;
		});
	}

	meal.save(function onMealSave(err) {
		if (err) return next(err);
		return res.status(200).json(meal);
	});
};

module.exports = create;
