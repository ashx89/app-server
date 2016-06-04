global.__base = __dirname;

var fs = require('fs');
var http = require('http');
var https = require('https');
var mongoose = require('mongoose');

var express = require('express');
var app = express();

var vhost = require('vhost');
var config = require('config');

/**
 * Import application utils error
 */
var errorHandler = require('../app-util').error;

/**
 * Import sub applications
 */
var authenticationApp = require('../app-auth')(config);

/**
 * Import application utils token
 */
var tokenHandler = require('../app-util').token;
tokenHandler.setConfig(config);

/**
 * App Settings
 */
app.disable('x-powered-by');
app.enable('trust proxy');
app.set('json spaces', 2);
app.set('x-powered-by', false);
app.set('port', config.get('port'));
app.set('forceSSLOptions', config.get('ssl'));

/**
 * App Middleware
 */
app.use(require('helmet').hsts({ maxAge: 123000, includeSubdomains: true, force: true }));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
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
 * Routes:: API Application
 */
app.use(vhost(config.get('apiHost'), authenticationApp));

/**
 * Routes:: Not Found
 */
app.all('*', function onNotFound(req, res) {
	return res.status(404).json({
		title: 'Resource not found',
		status: 404,
		path: req.path
	});
});

/**
 * Routes:: Error Handler
 */
app.use(errorHandler);

/**
 * HTTP Connection
 */
mongoose.connect(config.get('database'), function onDatabaseConnect(err) {
	if (err) throw err;

	https.createServer({
		key: fs.readFileSync('./server.key'),
		cert: fs.readFileSync('./server.crt')
	}, app).listen(config.get('ssl.httpsPort'));

	http.createServer(app).listen(config.get('port'));

	app.get('/', function onAppStart(req, res) {
		return res.sendStatus(200).json({
			status: 200,
			message: 'Welcome to the application API'
		});
	});
});
