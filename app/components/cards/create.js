var cards = require(__base + '/app/lib/cards');

var Account = require(__base + '/app/models/account');

/**
 * Create a card
 */
var create = function onFetch(req, res, next) {
	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		cards.create(account.customer_id, req.body.stripeToken, function onCardCreate(err, card) {
			if (err) return next(err);

			account.cards.push(card.id);

			account.save(function onSave(err) {
				if (err) return next(err);
				return res.status(200).json(account);
			});
		});
	});
};

module.exports = create;
