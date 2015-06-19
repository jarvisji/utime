/**
 * Created by Ting on 2015/6/5.
 */
var wechat = require('wechat');
var config = {
  token: '25bd8f7d6f1f6c1e77be91933ecc1775',
  appid: 'wx21dd1e3d5805f2e9',
  encodingAESKey: '97KnuHVACsOkJtV2iakZqbVpdWuomoTxPPl9VTUR6KH'
};

module.exports = function () {
  return wechat(config, function (req, res, next) {

    console.log("============wechat");
  });
};
