var path = require('path');
var s3 = require('app-util').s3();

/**
 * Menu Model
 */
var Menu = require(__base + '/app/models/menu');

/**
 * Create a meal item
 */
var create = function onCreate(req, res, next) {
	var item = {
		title: req.body.title,
		extra: req.body.extra,
		description: req.body.description
	};

	if (req.file) {
		var ext = path.extname(req.file.originalname);
		var filename = req.body.title.replace(' ', '-') + ext;

		filename = filename.toLowerCase();

		item.image = req.user.resource + filename;

		var params = {
			ACL: 'public-read',
			Key: req.user._id + '/' + filename,
			ContentType: req.file.mimetype,
		};

		s3.save(params, req.file.buffer, function onSave(err, result) {
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
