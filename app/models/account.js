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
	return value.length < 300;
}

var accountSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	storename: {
		type: String,
		required: [true, 'Missing Storename'],
		validate: [validator.isAlpha, 'Invalid Storename']
	},
	description: {
		type: String,
		validate: [validTextLength, 'Description is too long']
	},
	image: {
		type: String
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
		},
		country: {
			type: String
		},
		country_code: {
			type: String
		},
	},
	cooking_days: {
		type: Array,
		required: [true, 'Missing Cooking Days']
	},
	excluded_days: {
		type: Array
	},
	currency: {
		type: String
	},
	costs_tier: [{
		price: {
			type: Number,
			required: [true, 'Missing Price Cost'],
			validate: [validator.isNumeric, 'Invalid Price']
		},
		days: {
			type: Number,
			required: [true, 'Missing Number of Days'],
			validate: [validator.isNumeric, 'Invalid Number of Days']
		},
		meals: {
			type: Number,
			required: [true, 'Missing Meals per Day'],
			validate: [validator.isNumeric, 'Invalid Meals per Day']
		}
	}],
	delivery: {
		radius: {
			type: Number,
			required: [true, 'Missing Delivery Radius']
		},
		is_free: {
			type: Boolean,
			default: true
		},
		cost: {
			type: Number,
			required: [true, 'Missing Minimum Delivery Cost']
		},
		free_over: {
			type: Number,
			required: [true, 'Missing Cost for Free Delivery']
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
	return { price: this.costs_tier[0].price, days: this.costs_tier[0].days };
});

accountSchema.pre('save', function onModelSave(next) {
	var account = this;

	// Set delivery radius. (miles * meteres in miles). Geocoder uses meteres
	account.delivery.radius = parseInt(account.delivery.radius, 10) * METERS_IN_MILES;

	if (account.delivery.is_free === true) account.delivery.free_over = undefined;
	if (account.delivery.cost === 0) account.delivery.free_over = undefined;

	geocoder.geocode(account.fulladdress, function onGeocode(err, res) {
		if (err) return next(err);
		account.address.location = [res[0].latitude, res[0].longitude];
		account.address.country = res[0].country;
		account.address.country_code = res[0].countryCode;
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
