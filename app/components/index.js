var express = require('express');
var multer = require('multer');

var app = express();

var uploadImage = multer().single('image');

/**
 * Rest:: Account
 */
app.get('/account', require('./account/fetch'));
app.post('/account', uploadImage, require('./account/create'));
app.patch('/account', uploadImage, require('./account/update'));

/**
 * Rest:: Meals
 */
app.get('/meals', require('./meals/fetch'));
app.get('/meals/:id', require('./meals/fetch'));
app.delete('/meals/:id', require('./meals/delete'));

app.post('/meals', uploadImage, require('./meals/create'));
app.patch('/meals/:id', uploadImage, require('./meals/update'));

/**
 * Rest:: Basket
 */
app.post('/basket', require('./basket').update);
app.delete('/basket', require('./basket').delete);

module.exports = app;
