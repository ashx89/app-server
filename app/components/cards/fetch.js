var cards = require(__base + '/app/lib/cards');

var Account = require(__base + '/app/models/account');

/**
 * Fetch a card
 */
var fetch = function onFetch(req, res, next) {
	var cardId = req.params.id;

	function onFetchCards(err, cards) {
		if (err) return next(err);
		return (cards.data) ? res.status(200).json(cards.data) : res.status(200).json(cards);
	}

	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		(cardId) ? cards.fetch(account.customer_id, cardId, onFetchCards) : cards.fetchAll(account.customer_id, onFetchCards);
	});
};

module.exports = fetch;
