var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var customer = {
	/**
	 * Create a stripe customer account
	 * @param {object} user. User data from req object
	 * @param {function} callback
	 */
	create: function onCustomerCreate(user, callback) {
		if (!user || !user._id) return callback(new Error('Invalid User Details'));

		var object = {
			email: user.email,
			description: user.email,
			metadata: {
				user: user._id
			}
		};

		stripe.customers.create(object, function onStripeCreate(err, results) {
			return callback(err, results);
		});
	},

	/**
	 * Fetch a stripe customer account
	 * @param {string} customerId. ID from stripe account
	 * @param {function} callback
	 */
	fetch: function onCustomerFetch(customerId, callback) {
		if (!customerId) return callback(new Error('Invalid Customer ID'), null);

		stripe.customers.retrieve(customerId, function onStripeRetrieve(err, results) {
			return callback(err, results);
		});
	},

	/**
	 * Update a stripe customer account
	 * @param {string} customerId. ID from stripe account
	 * @param {object} data. Object to update stripe account
	 * @param {function} callback
	 */
	update: function onCustomerUpdate(customerId, data, callback) {
		if (!customerId) return callback(new Error('Invalid Customer ID'), null);

		stripe.customers.update(customerId, data, function onStripeUpdate(err, results) {
			return callback(err, results);
		});
	}
};

module.exports = customer;
