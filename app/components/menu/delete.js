var bucket = 'users/';

/**
 * Menu Model
 */
var Menu = require(__base + '/app/models/menu');

/**
 * Delete a menu item
 */
var remove = function onDelete(req, res, next) {
	var id = req.params.id;

	var query = { user: req.user._id };

	Menu.findOneAndRemove(query, function onUpdate(err, result) {
		if (err) return next(err);

		return res.status(200).json({});
	});
};

module.exports = remove;
