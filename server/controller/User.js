/**
 * Created by Ting on 2015/7/2.
 */

var mongoose = require('mongoose');
var sha512 = require('crypto-js/sha512');
var debug = require('debug')('utime.userCtrl');
//var error = debug('app:error');
var schemas = require('../schemas');

module.exports = function () {
  var User = mongoose.model('User', schemas.userSchema);
  var jsonResult = function (result, mix) {
    var jsonRet = {data: []};
    if (result instanceof Error) {
      jsonRet.error = result;
    } else if (typeof(result) == 'string') {
      jsonRet.message = result;
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
  var login = function (req, res) {
    var loginUser = req.body;
    if (typeof(loginUser) == 'object' && loginUser.mobile && loginUser.password) {
      User.findOne({'mobile': loginUser.mobile}, function (err, user) {
        if (err) {
          debug('Find user error: ', err);
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
      res.status(400).json(jsonResult('Invalid request data'));
    }
  };

  var getUsers = function (req, res) {
    var User = mongoose.model('User', schemas.userSchema);
    User.find(function (err, users) {
      if (err) return console.error(err);
      res.json(users);
    });
  };

  var createUser = function (req, res) {
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
  };

  return {
    login: login,
    createUser: createUser,
    getUsers: getUsers
  };
};
