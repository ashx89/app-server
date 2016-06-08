var express = require('express');
var multer = require('multer');

var app = express();

app.get('/account', require('./account/fetch'));
app.post('/account', require('./account/create'));

//app.get('/menu', require('./menu/fetch'));
app.post('/menu', multer().single('image'), require('./menu/create'));

module.exports = app;
