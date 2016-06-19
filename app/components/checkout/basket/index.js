var token = require('app-util').token;

var COOKIE_NAME = 'basket';

module.exports = {
	update: function onUpdateBasket(req, res) {
		res.cookie(COOKIE_NAME, token.create(req.body, { expiresIn: process.env.USER_TOKEN_EXPIRY }, { httpOnly: true }));
		return res.status(200).json(token.get(req, COOKIE_NAME));
	},

	delete: function onDeleteBasket(req, res) {
		res.cookie(COOKIE_NAME, null, { expires: new Date() });
		return res.status(200).json({});
	}
};

/*
{
	basket: {
		prepmaker_id: "",
		note: "",
		items: [{
			id: "",
			title: "",
			cost_tier: "",
			cooking_day: ""
		}]
		subtotal: ""
	}
}
*/