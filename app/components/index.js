var express = require('express');
var multer = require('multer');

var app = express();

app.get('/account', require('./account/fetch'));
app.post('/account', require('./account/create'));

//app.get('/menu', require('./menu/fetch'));
app.post('/menu', multer().single('image'), require('./menu/create'));
app.delete('/menu/:id', require('./menu/delete'));

app.delete('/menu/:id/item/:itemid', require('./menu/item/delete'));

module.exports = app;
