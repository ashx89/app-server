var geocoder = require('node-geocoder')('google', 'https');
var mongoose = require('mongoose');
var validator = require('mongoose-validators');

var METERS_IN_MILES = 1609.34;

/**
 * Postcode max length 9. e.g. AB12 34CD
 */
function validPostcodeLength(value) {
	return value && value.length <= 9;
}

/**
 * Check description character length
 */
function validTextLength(value) {
	return value.length > 300;
}

var accountSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	resource: {
		type: String,
	},
	storename: {
		type: String,
		required: [true, 'Missing Storename'],
		validate: [validator.isAlpha, 'Invalid Storename']
	},
	description: {
		type: String,
		validate: [validTextLength, 'Description is too long']
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
			required: [true, 'Missing Postcode'],
			validate: [
				{ validator: validator.isAlphanumeric, message: 'Invalid Postcode' },
				{ validator: validPostcodeLength, message: 'Invalid Postcode' }
			]
		},
		location: {
			type: [Number],
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
	costs_tier: [{
		price: {
			type: Number,
			required: [true, 'Missing Price Cost'],
			validate: [validator.isNumeric, 'Invalid Price']
		},
		period: {
			type: Number,
			required: [true, 'Missing Number of Days'],
			validate: [validator.isNumeric, 'Invalid Number of Days']
		}
	}],
	delivery: {
		radius: {
			type: Number,
			required: [true, 'Missing Delivery Radius']
		},
		min_cost: {
			type: mongoose.Schema.Types.Mixed,
			required: [true, 'Missing Minimum Delivery Cost'],
			validate: [validator.isNumeric, 'Invalid Minimum Delivery Cost']
		},
		max_cost: {
			type: mongoose.Schema.Types.Mixed,
			required: [true, 'Missing Maximum Delivery Cost']
		}
	}
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

/**
 * Get the full address
 */
accountSchema.virtual('minimum_order').get(function onGetMinimumOrder() {
	return { price: this.costs_tier[0].price, period: this.costs_tier[0].period };
});

accountSchema.pre('save', function onModelSave(next) {
	var account = this;

	account.delivery.radius = parseInt(account.delivery.radius, 10) * METERS_IN_MILES;

	if (account.delivery.min_cost === 0) account.delivery.min_cost = 'Free';
	if (account.delivery.max_cost === 0) account.delivery.max_cost = 'Free';

	geocoder.geocode(account.fulladdress, function onGeocode(err, res) {
		if (err) return next(err);
		account.address.location = [res[0].latitude, res[0].longitude];
		return next();
	});
});

accountSchema.set('toJSON', {
	virtuals: true,
	transform: function onTransform(doc, ret) {
		delete ret.id;
		delete ret.__v;
		return ret;
	}
});

module.exports = mongoose.model('Account', accountSchema);
