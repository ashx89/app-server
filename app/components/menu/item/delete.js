var bucket = 'users/';

/**
 * Menu Model
 */
var Menu = require(__base + '/app/models/menu');

/**
 * Delete a meal item
 */
var remove = function onDelete(req, res, next) {
	var itemid = req.params.itemid;

	var query = { user: req.user._id };
	var operation = { $pull: { items: { _id: itemid } } };
	var options = { new: true };

	Menu.findOneAndUpdate(query, operation, options, function onUpdate(err, result) {
		if (err) return next(err);

		return res.status(200).json(result);
	});
};

module.exports = remove;
