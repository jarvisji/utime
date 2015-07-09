var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var sha512 = require('crypto-js/sha512');
var schemas = require('./schemas');
var userCtrl = require('./controller/User')();
var app = express();

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// connect to MongoDB
mongoose.connect('mongodb://localhost:27000/utime');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Connected to MongoDB success.');
  registerRoutes();
});

var registerRoutes = function () {
  app.post('/users', userCtrl.createUser);
  app.post('/login', userCtrl.login);
  app.get('/users', userCtrl.getUsers); // this is just for test.
};

var server = app.listen('3000', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server listening at: http://%s:%s', host, port);
});
