var express = require('express');
var app = express();

app.get('/account', require('./account/fetch'));
app.post('/account', require('./account/create'));

module.exports = app;
