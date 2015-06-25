/**
 * Created by jiting on 15/6/1.
 */
var wechat = require('wechat');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('./server/wechat-config.json', {encoding: 'UTF-8'}));

module.exports = function () {
  return wechat(config, function (req, res, next) {
    var message = req.weixin;
    console.log(message)
  })
};
