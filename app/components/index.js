var express = require('express');
var app = express();

module.exports = function onAccountExport() {
	app.get('/account', require('./account/fetch'));
	app.post('/account', require('./account/create'));

	return app;
};
