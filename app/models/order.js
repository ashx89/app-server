var mongoose = require('mongoose');
var validator = require('mongoose-validators');

var orderSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	prepmaker: { type: mongoose.Schema.Types.ObjectId },

	card_id: String,
	user_address: String,

	total_meals: Number,
	scheduled_cooking_day: String,

	note: {
		type: String,
		validate: [validator.isAlphanumeric, 'Invalid Note']
	},
	items: [{
		id: { type: mongoose.Schema.Types.ObjectId },
		title: String,
		costs_tier: Number
	}],
	payment: {
		currency_code: String,
		currenct_symbol: String,
		country_code: String,
		delivery_charge: Number,
		surcharge: Number,
		subtotal: Number,
		total: Number,
		debit_amount_total: String
	}
});

orderSchema.set('toJSON', {
	virtuals: true,
	transform: function onTransform(doc, ret) {
		delete ret.id;
		delete ret.__v;
		return ret;
	}
});

module.exports = mongoose.model('Order', orderSchema);
