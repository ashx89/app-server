global.__base = __dirname;
require('dotenv').config();

var fs = require('fs');
var util = require('app-util');
var http = require('http');
var https = require('https');
var vhost = require('vhost');
var config = require('config');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

var errorHandler = util.error;
var tokenHandler = util.token;

tokenHandler.setConfig(config);

/**
 * App Settings
 */
app.set('json spaces', 2);
app.enable('trust proxy');
app.disable('x-powered-by');
app.set('x-powered-by', false);
app.set('port', process.env.PORT || 3000);
app.set('forceSSLOptions', config.get('ssl'));

/**
 * App Middleware
 */
app.use(require('helmet').hsts({ maxAge: 123000, includeSubdomains: true, force: true }));
app.use(bodyParser.urlencoded({ keepExtensions: true, extended: true }));
app.use(bodyParser.json())
app.use(require('express-validator')({
	errorFormatter: function onFormat(param, message, value) {
		return {
			status: 400,
			value: value,
			param: param,
			message: message,
			code: 'invalid_input',
			name: 'ValidationError',
			title: 'Validation Error'
		};
	}
}));
app.use(require('cookie-parser')());
app.use(require('method-override')());
app.use(require('morgan')('dev'));
app.use(require('express-force-ssl'));
app.use(tokenHandler.require());

/**
 * Import sub applications
 */
var authenticationApp = require('app-auth');
var componentsApp = require('./app/components');
var ordersApp = require('../app-order');

app.use(vhost(process.env.API_HOST, authenticationApp));
app.use(vhost(process.env.API_HOST, componentsApp));
app.use(vhost(process.env.API_HOST, ordersApp));

app.get('/', function onAppStart(req, res) {
	return res.status(200).json({
		status: 200,
		message: 'Welcome to the application API'
	});
});

/**
 * Return decoded token
 */
app.get('/verify', tokenHandler.verify, function onTokenVerify(req, res) {
	return res.status(200).json(req.decoded);
});

app.all('*', function onNotFound(req, res) {
	return res.status(404).json({
		title: 'Resource not found',
		status: 404,
		path: req.path
	});
});

/**
 * Application Error Handling
 */
app.use(errorHandler);

/**
 * HTTP Connection
 */
mongoose.connect(process.env.DATABASE, function onDatabaseConnect(err) {
	if (err) throw err;

	https.createServer({
		key: fs.readFileSync('./server.key'),
		cert: fs.readFileSync('./server.crt')
	}, app).listen(config.get('ssl.httpsPort'));

	http.createServer(app).listen(process.env.PORT);
});
