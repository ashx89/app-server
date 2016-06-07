var s3 = require('app-util').s3();
/**
 * Menu Model
 */
var Menu = require(__base + '/app/models/menu');

/**
 * Create an account
 */
var create = function onCreate(req, res, next) {
	var item = {
		title: req.body.title,
		extra: req.body.extra,
		description: req.body.description
	};

	if (req.body.image) {
		item.image = req.user.resource + req.body.title + '.jpg';

		s3.save(req.user._id + '/' + req.body.title + '.jpg', req.body.image, function (err) {
			if (err) return next(err);
		});
	}

	Menu.findOne({ user: req.user._id }, function onFind(err, menu) {
		if (err) return next(err);

		if (!menu) {
			var menu = new Menu();
			menu.user = req.user._id;
		}

		menu.items.push(item);

		menu.save(function onMenuSave(err) {
			if (err) return next(err);
			return res.status(200).json(menu);
		});
	});
};

module.exports = create;
