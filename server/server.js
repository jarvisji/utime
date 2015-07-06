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
      User.findOne({'mobile': loginUser.mobile}, function (err, user) {
        if (err) {
          console.error(err);
          return res.status(500).json(jsonResult(err));
        }
        if (user) {
          var hashedPassword = sha512(user.salt + loginUser.password);
          if (user.password == hashedPassword) {
            var returnUser = user.toObject();
            delete returnUser.password;
            delete returnUser.salt;
            res.json(jsonResult(returnUser));
          } else {
            res.status(401).json(jsonResult(new Error('Login failed.')));
          }
        } else {
          res.status(401).json(jsonResult(new Error('Login failed.')));
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
        if (err.code == 11000) // duplicate key
          return res.status(409).json(jsonResult(err));
        else
          return res.status(500).json(jsonResult(err));
      }
      console.log('saved user:', data);
      var retData = data.toObject();
      delete retData.password;
      delete retData.salt;
      res.status(201).json(jsonResult(retData));
    });
  });
};

var jsonResult = function (result, mix) {
  var jsonRet = {};
  if (result instanceof Error) {
    jsonRet.error = {message: result.message, type: result.name};
  } else {
    jsonRet.data = result;
    if (result instanceof Array) {
      jsonRet.count = result.length;
    }
  }
  if (mix && mix instanceof Object) {
    var keys = Object.keys(mix);
    for (var key in keys) {
      jsonRet[key] = mix[key];
    }
  }
  return jsonRet;
};

var server = app.listen('3000', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server listening at: http://%s:%s', host, port);
});
