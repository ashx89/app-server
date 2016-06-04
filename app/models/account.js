var mongoose = require('mongoose');
var validator = require('mongoose-validators');

/**
 * Postcode max length 9. e.g. AB12 34CD
 */
function validPostcodeLength(value) {
	return value && value.length <= 9;
}

var accountSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	menu: { type: mongoose.Schema.Types.ObjectId },

	resource: {
		type: String,
	},
	storename: {
		type: String,
		required: [true, 'Missing Storename'],
		validate: [validator.isAlpha, 'Invalid Storename']
	},
	address: {
		address_line: {
			type: String,
			validate: [validator.isAlphanumeric, 'Invalid Address Line']
		},
		city: {
			type: String,
			validate: [validator.isAlpha, 'Invalid City']
		},
		postcode: {
			type: String,
			validate: [
				{ validator: validator.isAlphanumeric, message: 'Invalid Postcode' },
				{ validator: validPostcodeLength, message: 'Invalid Postcode' }
			]
		},
		location: {
			type: Number,
			index: '2d'
		}
	},
	cooking_days: {
		type: Array,
		required: [true, 'Missing Cooking Days']
	},
	meals_per_day: {
		type: Number,
		required: [true, 'Missing Meals per Day'],
		validate: [validator.isNumeric, 'Invalid Meals per Day']
	},
	minimum_order_days: {
		type: Number,
		max: [7, 'Maximum exceeds number of days in the week'],
		validate: [validator.isNumeric, 'Invalid Minimum Order Days']
	},
	costs_tier: [{
		price: {
			type: Number,
			required: [true, 'Missing Price Cost'],
			validate: [validator.isNumeric, 'Invalid Price']
		},
		period: {
			type: String,
			required: [true, 'Missing Number of Days'],
			validate: [validator.isNumeric, 'Invalid Number of Days']
		}
	}]
}, {
	minimize: true,
	timestamps: true
});

/**
 * Get the full address
 */
accountSchema.virtual('fulladdress').get(function onGetFullAddress() {
	return this.address.address_line + ', ' + this.address.city + ', ' + this.address.postcode;
});

module.exports = mongoose.model('Account', accountSchema);
