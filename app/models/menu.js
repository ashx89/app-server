var mongoose = require('mongoose');
var validator = require('mongoose-validators');

function validTextLength(value) {
	return value.length > 300;
}

var menuSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	items: [{
		title: {
			type: String,
			requried: [true, 'Missing Title'],
			validate: [validator.isAlpha, 'Invalid Title']
		},
		description: {
			type: String,
			validate: [validTextLength, 'Description is too long']
		},
		extra_information: {
			type: String,
			validate: [validTextLength, 'Extra Information is too long']
		}
	}]
});

menuSchema.set('toJSON', {
	virtuals: true,
	transform: function onTransform(doc, ret) {
		delete ret.id;
		delete ret.__v;
		return ret;
	}
});

module.exports = mongoose.model('Menu', menuSchema);
