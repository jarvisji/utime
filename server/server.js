var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var sha512 = require('crypto-js/sha512');
var schemas = require('./schemas');
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
  app.post('/login', function (req, res) {
    var loginUser = req.body;
    if (typeof(loginUser) == 'object' && loginUser.mobile && loginUser.password) {
      var User = mongoose.model('User', schemas.userSchema);
      User.findOne({'mobile': loginUser.mobile}, 'password salt', function (err, user) {
        if (err) {
          console.error(err);
          res.send(err);
        }
        var hashedPassword = sha512(user.salt + loginUser.password);
        if (user.password == hashedPassword) {
          res.send('success');
        } else {
          res.send('fail');
        }
      });
    } else {
      res.send('Invalid request data');
    }
  });
  app.get('/users', function (req, res) {
    var User = mongoose.model('User', schemas.userSchema);
    User.find(function (err, users) {
      if (err) return console.error(err);
      res.json(users);
    });
  });

  app.post('/users', function (req, res) {
    var User = mongoose.model('User', schemas.userSchema);
    var user = new User(req.body);
    user.salt = Math.round((new Date().valueOf() * Math.random()));
    user.password = sha512(user.salt + user.password);
    user.save(function (err, data) {
      if (err) {
        console.error(err);
        res.send(err)
      }
      console.log('saved user:', data);
      res.send(data)
    });
  });
};

var server = app.listen('3000', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server listening at: http://%s:%s', host, port);
});
