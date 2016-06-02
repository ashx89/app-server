global.__base = __dirname;

var fs = require('fs');
var http = require('http');
var https = require('https');

var express = require('express');
// var mongoose = require('mongoose');

var app = express();
var vhost = require('vhost');
var config = require('config');
var requireToken = require('./middleware/token').require();


/**
 * App Settings
 */
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
app.use(require('express-validator')());
app.use(require('cookie-parser')());
app.use(require('method-override')());
app.use(require('morgan')('dev'));
app.use(require('express-force-ssl'));
app.use(requireToken);

/**
 * Check for token on routes
 */


/**
 * Routes :: Authentication
 */
app.use(vhost(config.get('apiHost'), require('./app/authentication')));

/**
 * Routes :: Error
 */
app.use(require('./middleware/error'));

/**
 * HTTP Connection
 */
https.createServer({
	key: fs.readFileSync('./server.key'),
	cert: fs.readFileSync('./server.crt')
}, app).listen(config.get('ssl.httpsPort'));

http.createServer(app).listen(config.get('port'));

app.get('/', function onAppStart(req, res) {
	return res.sendStatus(200);
});
