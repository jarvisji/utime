/**
 * Created by jiting on 15/6/1.
 */
var wechat = require('wechat');
var wechatApi = require('wechat-api');
var fs = require('fs');
var debug = require('debug')('utime.wechat');

var User = require('../models').User;
var resources = require('../resources')();
var config = JSON.parse(fs.readFileSync('./server/wechat-config.json', {encoding: 'UTF-8'}));

module.exports = function () {
  var api = new wechatApi(config.appid, config.appsecret);
  //var access_token;
  //api.getLatestToken(function (err, token) {
  //  access_token = token;
  //});

  /**
   * Get wechat account information and create utime account if not exist.
   * @param message
   * @param res
   */
  var subscribe = function (message, res) {
    res.reply(resources.get('event.subscribe.welcome'));
    api.getUser(message.FromUserName, function (err, result) {
        if (err) return debug('Get wechat user error: ', err);
        User.update({"wechat.openid": result.openid}, {
          mobile: result.openid,
          wechat: result
        }, {upsert: true}, function (err, raw) {
          if (err) return debug('User subscribe error: ', err);
          debug('User subscribe success: ', raw);
        });
      }
    )
  };

  var unsubscribe = function (message, res) {
    res.reply('unsubscribed');
    User.update({'wechat.openid': message.FromUserName}, {'wechat.subscribe': 0}, function (err, result) {
      if (err) debug('Update user subscribe status error: ', err);
      debug('User unsubscribe success: ', result);
    })
  };

  return wechat(config, function (req, res, next) {
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
