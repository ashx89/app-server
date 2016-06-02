var express = require('express');
var app = express();

/**
 * Authentication Controller
 */
var controller = require('./controller');

/**
 * Authentication Routes
 */
app.get('/auth/register', controller.register);

module.exports = app;
