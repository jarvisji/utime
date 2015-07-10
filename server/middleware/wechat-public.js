/**
 * Created by jiting on 15/6/1.
 */
var wechat = require('wechat');
var wechatApi = require('wechat-api');
var fs = require('fs');
var debug = require('debug')('utime.wechat');

var User = require('../models').User;
var config = JSON.parse(fs.readFileSync('./server/wechat-config.json', {encoding: 'UTF-8'}));

module.exports = function () {
  var api = new wechatApi(config.appid, config.appsecret);
  //var access_token;
  //api.getLatestToken(function (err, token) {
  //  access_token = token;
  //});


  return wechat(config, function (req, res, next) {
      var message = req.weixin;
      if (message.Event == 'subscribe') {
        api.getUser(message.FromUserName, function (err, result) {
            if (err) return debug('Get wechat user error: ', err);
            User.update({"wechat.openid": result.openid}, {
              mobile: result.openid,
              wechat: result
            }, {upsert: true}, function (err, raw) {
              if (err) return debug('Save user error: ', err);
              debug('saved:', raw);
            });
          }
        )
      }
      debug('wechat: ', message);
      res.reply(message);
    }
  )
}
;
