var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var charge = {
	/**
	 * Create a stripe charge
	 * @param {object} account
	 * @param {object} charge
	 * @param {function} callback
	 */
	create: function onChargeCreate(account, charge, callback) {
		if (!account) return callback(new Error('Invalid account details'), null);
		if (!charge) return callback(new Error('Invalid charge details'), null);

		stripe.charges.create({
			amount: charge.total,
			currency: account.currency,
			customer: account.customer_id,
		}, function onStripeCreate(err, results) {
			return callback(err, results);
		});
	}
};

module.exports = charge;
