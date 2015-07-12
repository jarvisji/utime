/**
 * Created by jiting on 15/6/1.
 */
var wechat = require('wechat');
var wechatApi = require('wechat-api');
var fs = require('fs');
var debug = require('debug')('utime.wechat');

var User = require('../models').User;
var resources = require('../resources')();
var conf = require('../conf');
//var config = JSON.parse(fs.readFileSync('./server/wechat-config.json', {encoding: 'UTF-8'}));

module.exports = function () {
  var api = new wechatApi(conf.wechat.appid, conf.wechat.appsecret);

  /**
   * Get wechat account information and create utime account if not exist.
   * @param message
   * @param res
   */
  var subscribe = function (message, res) {
    debug('User subscribe');
    api.getUser(message.FromUserName, function (err, result) {
        if (err) return debug('Subscribe: Get wechat user error: ', err);
        User.find({"wechat.openid": result.openid}, function (err, user) {
          if (err) return debug('Subscribe: Find user in db error: ', err);
          if (user.length && user.length > 0) {
            debug('Subscribe: User exist, update.');
            User.update({"wechat.openid": result.openid}, {
              wechat: result
            }, function (err, raw) {
              if (err) return debug('Subscribe: Update user error: ', err);
              debug('Subscribe: Update user success: ', raw);
              res.reply(resources.get('event.subscribe.welcome'));
            });
          } else {
            debug('Subscribe: User not exist, create.');
            User.create({
              mobile: 'openid_' + result.openid,
              wechat: result
            }, function (err, raw) {
              if (err) return debug('Subscribe: Save user error: ', err);
              debug('Subscribe: Save user success: ', raw);
              res.reply(resources.get('event.subscribe.welcome'));
            });
          }
        });
      }
    );
  };

  var unsubscribe = function (message, res) {
    debug('User unsubscribe');
    User.update({'wechat.openid': message.FromUserName}, {'wechat.subscribe': 0} , function (err, result) {
      if (err) debug('Unsubscribe: Update user subscribe status error: ', err);
      debug('Unsubscribe: User unsubscribe success: ', result);
      res.reply('unsubscribed');
    })
  };

  return wechat(conf.wechat, function (req, res, next) {
      var message = req.weixin;
      debug('Receive wechat message: ', message);
      if (message.Event == 'subscribe') {
        subscribe(message, res);
      }
      if (message.Event == 'unsubscribe') {
        unsubscribe(message, res);
      }
    }
  )
}
;
