/**
 * Test events handle from wechat server.
 * Created by Ting on 2015/7/12.
 */
var request = require('request');
var mongoose = require('mongoose');
var User = require('../../../server/models').User;
describe('Test events handle from wechat server.', function () {
  var reqOption;
  var url = 'http://localhost:3001/wxproxy/?signature=32db9dfb58aa2ff2da44d09e6c0d4c6c1e03a0c5&echostr=2152790343655210619&timestamp=1433481275&nonce=1552612961';
  mongoose.connect('mongodb://localhost:27000/utime');
  var db = mongoose.connection;
  //beforeAll(function(){
  //  // TODO: delete test data for user. Get mongoose from util.
  //});
  beforeEach(function () {

    reqOption = {url: url};
  });


  it('Test user subscribe.', function (done) {
    var userOpenId = 'oWTqJs8SEbDON98vMor20rnXh9UQ';
    reqOption.body = '<xml>';
    reqOption.body += '<ToUserName><![CDATA[gh_6a821daa4090]]></ToUserName>';
    reqOption.body += '<FromUserName><![CDATA[' + userOpenId + ']]></FromUserName>';
    reqOption.body += '<CreateTime>1436444304</CreateTime>';
    reqOption.body += '<MsgType><![CDATA[event]]></MsgType>';
    reqOption.body += '<Event><![CDATA[subscribe]]></Event>';
    reqOption.body += '</xml>';
    request.post(reqOption, function (error, response, body) {
      User.findOne({'wechat.openid': userOpenId}, function (err, user) {
        done();
        expect(response.statusCode).toEqual(200);
        expect(err).toBe(null);
        expect(user.created).toBeDefined();
        expect(user.lastModified).toBeDefined();
        expect(user.wechat.subscribe).toEqual(1);
      });
    })
  });
});
