var mongoose = require('mongoose');
var validator = require('mongoose-validators');

function validTextLength(value) {
	return value.length < 300;
}

var mealSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	title: {
		type: String,
		required: [true, 'Missing Title'],
		validate: [validator.isAlpha, 'Invalid Title']
	},
	image: {
		type: String
	},
	description: {
		type: String,
		validate: [validTextLength, 'Description is too long']
	},
	extra: {
		type: String,
		validate: [validTextLength, 'Extra Information is too long']
	}
});

mealSchema.set('toJSON', {
	virtuals: true,
	transform: function onTransform(doc, ret) {
		delete ret.id;
		delete ret.__v;
		return ret;
	}
});

module.exports = mongoose.model('Meal', mealSchema);
