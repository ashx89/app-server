var express = require('express');
var multer = require('multer');

var app = express();

app.get('/account', require('./account/fetch'));
app.post('/account', require('./account/create'));
app.patch('/account', require('./account/update'));

app.get('/meals', require('./meals/fetch'));
app.get('/meals/:id', require('./meals/fetch'));
app.post('/meals', multer().single('image'), require('./meals/create'));
app.patch('/meals/:id', multer().single('image'), require('./meals/update'));
app.delete('/meals/:id', require('./meals/delete'));

app.post('/basket', require('./basket').update);
app.delete('/basket', require('./basket').delete);

module.exports = app;
