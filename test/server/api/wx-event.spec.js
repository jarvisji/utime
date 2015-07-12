/**
 * Test events handle from wechat server.
 * Created by Ting on 2015/7/12.
 */
var request = require('request');
var mongoose = require('mongoose');
var conf = require('../../../server/conf');
var User = require('../../../server/models').User;
describe('Test events handle from wechat server.', function () {
  var reqOption;
  var userOpenId = 'oWTqJs_isFdwO0vesXACDsELhiLI'; //'oWTqJs8SEbDON98vMor20rnXh9UQ';
  mongoose.connect(conf.mongoDbUrl);
  var db = mongoose.connection;
  //beforeAll(function(){
  //  // TODO: delete test data for user. Get mongoose from util.
  //});
  beforeEach(function () {
    reqOption = {url: conf.wxProxyUrl};
  });

  it('Test user subscribe.', function (done) {
    console.log('subscribe start');
    currentCaseDone = false;
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
        console.log('subscribe end');
      });
    })
  });

  it('Test user unsubscribe.', function (done) {
    console.log('unsubscribe start');
    reqOption.body = '<xml>';
    reqOption.body += '<ToUserName><![CDATA[gh_6a821daa4090]]></ToUserName>';
    reqOption.body += '<FromUserName><![CDATA[' + userOpenId + ']]></FromUserName>';
    reqOption.body += '<CreateTime>1436444304</CreateTime>';
    reqOption.body += '<MsgType><![CDATA[event]]></MsgType>';
    reqOption.body += '<Event><![CDATA[unsubscribe]]></Event>';
    reqOption.body += '</xml>';
    request.post(reqOption, function (error, response, body) {
      User.findOne({'wechat.openid': userOpenId}, function (err, user) {
        done();
        expect(response.statusCode).toEqual(200);
        expect(err).toBe(null);
        expect(user.created).toBeDefined();
        expect(user.lastModified).toBeDefined();
        expect(user.created).not.toEqual(user.lastModified);
        expect(user.wechat.subscribe).toEqual(0);
        console.log('unsubscribe end');
      });
    })
  });
});

