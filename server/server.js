var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var debug = require('debug')('utime.app');

var conf = require('./conf');
var wechatPublic = require('./middleware/wechat-public');
var userCtrl = require('./controller/UserController')();
var app = express();

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// connect to MongoDB
mongoose.connect(conf.mongoDbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  debug('Connected to MongoDB success.');
  registerRoutes();
});

var registerRoutes = function () {
  //app.use('/wxproxy', function(req, res, next){
  //  debug('Got request data: ', req.body);
  //  next();
  //});
  app.use('/wxproxy', wechatPublic());
  app.post('/users', userCtrl.createUser);
  app.get('/users', userCtrl.getUsers); // this is just for test.
  app.post('/login', userCtrl.login);
};

var server = app.listen('3001', function () {
  var host = server.address().address;
  var port = server.address().port;
  debug('Server listening at: http://%s:%s', host, port);
});
