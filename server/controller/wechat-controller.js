/**
 Created by Ting on 2015/7/13.
 */
var wechatApi = require('wechat-api');
var conf = require('../conf');
var utils = require('../middleware/utils');
var debug = require('debug')('utime.wechatCtrl');
module.exports = function () {
  var api = new wechatApi(conf.wechat.appid, conf.wechat.appsecret);
  return {
    createMenu: function (req, res) {
      //TODO: need authorization before update menu
      api.createMenu(req.body, function (err, result) {
        if (err)
          res.json(utils.jsonResult(err));
        else {
          res.json(result);
        }
      })
    }
  }
};
