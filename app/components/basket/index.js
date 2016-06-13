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
		currency_code: "GBP",
		currency_symbol: "£",
		country_code: "GB",
		quantity: "",
		meals_cost: "",
		meals_duration: "",
		meals_in_order: "",
		meal: [],
		prep_charge: "",
		subtotal: "",
		total: "",
		user_address: ""
	},
	preperation: {
		cooking_day: "",
		delivery_day: "",
		deliver_to: ""
	},
	payment: {
		debit_amount: "",
		debit_amount_total: ""
	}
}
*/