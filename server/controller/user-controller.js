/**
 * Created by Ting on 2015/7/2.
 */

var sha512 = require('crypto-js/sha512');
var debug = require('debug')('utime.userCtrl');
var utils = require('../middleware/utils');
var User = require('../models').User;

module.exports = function () {
  var login = function (req, res) {
    var loginUser = req.body;
    if (typeof(loginUser) == 'object' && loginUser.mobile && loginUser.password) {
      User.findOne({'mobile': loginUser.mobile}, function (err, user) {
        if (err) {
          debug('Find user error: ', err);
          return res.status(500).json(utils.jsonResult(err));
        }
        if (user) {
          var hashedPassword = sha512(user.salt + loginUser.password);
          if (user.password == hashedPassword) {
            var returnUser = user.toObject();
            delete returnUser.password;
            delete returnUser.salt;
            res.json(utils.jsonResult(returnUser));
          } else {
            res.status(401).json(utils.jsonResult(new Error('Login failed.')));
          }
        } else {
          res.status(401).json(utils.jsonResult(new Error('Login failed.')));
        }
      });
    } else {
      res.status(400).json(utils.jsonResult('Invalid request data'));
    }
  };

  var getUsers = function (req, res) {
    User.find(function (err, users) {
      if (err) {
        debug('Find user error: ', err);
        return res.status(500).json(utils.jsonResult(err));
      }
      res.json(utils.jsonResult(users));
    });
  };

  var createUser = function (req, res) {
    var user = new User(req.body);
    user.salt = Math.round((new Date().valueOf() * Math.random()));
    user.password = sha512(user.salt + user.password);
    user.save(function (err, data) {
      if (err) {
        debug('Save user error: ', err);
        if (err.code == 11000) // duplicate key
          return res.status(409).json(utils.jsonResult(err));
        else
          return res.status(500).json(utils.jsonResult(err));
      }
      debug('Save user success: ', err);
      var retData = data.toObject();
      delete retData.password;
      delete retData.salt;
      res.status(201).json(utils.jsonResult(retData));
    });
  };

  return {
    login: login,
    createUser: createUser,
    getUsers: getUsers
  };
};
