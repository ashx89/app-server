var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var card = {
	/**
	 * Create a stripe card
	 * @param {object} req. Req object
	 * @param {function} callback
	 */
	create: function onCardCreate(customerId, stripeToken, callback) {
		if (!customerId) return callback(new Error('Invalid account details'), null);
		if (!stripeToken) return callback(new Error('Invalid payment token'), null);

		stripe.customers.createSource(customerId, { source: stripeToken }, function onStripeCreate(err, results) {
			return callback(err, results);
		});
	},

	/**
	 * Fetch a stripe card
	 * @param {string} customerId
	 * @param {string} cardId
	 * @param {function} callback
	 */
	fetch: function onCardFetch(customerId, cardId, callback) {
		if (!customerId) return callback(new Error('Invalid Customer ID'), null);
		if (!cardId) return callback(new Error('Invalid Card ID'), null);

		stripe.customers.retrieveCard(customerId, cardId, function onStripeFetch(err, results) {
			return callback(err, results);
		});
	},

	/**
	 * Fetch all stripe card
	 * @param {string} customerID
	 * @param {function} callback
	 */
	fetchAll: function onCardsFetch(customerId, callback) {
		if (!customerId) return callback(new Error('Invalid Customer ID'), null);

		stripe.customers.listCards(customerId, function(err, results) {
			return callback(err, results);
		});
	}
};

module.exports = card;
