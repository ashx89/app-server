var express = require('express');
var app = express();

app.get('/account', require('./account/fetch'));
app.post('/account', require('./account/create'));

//app.get('/menu', require('./menu/fetch'));
app.post('/menu', require('./menu/create'));

module.exports = app;
