/**
 * Test User APIs.
 */
var request = require('request');
describe('Test user APIs.', function () {
  var reqOption;
  var mockMobile = 'test-' + new Date().getTime();
  var newUser = {mobile: mockMobile, password: 'pass', wechat: {openid: mockMobile}};

  //beforeAll(function(){
  //  // TODO: delete test data for user. Get mongoose from util.
  //});
  beforeEach(function () {
    reqOption = {url: 'http://localhost:3001', json: true};
  });

  it('Test register new user', function (done) {
    reqOption.url += '/users';
    reqOption.body = newUser;
    request.post(reqOption, function (error, response, body) {
      done();
      expect(response.statusCode).toEqual(201);
      expect(body.data._id).toBeDefined();
      expect(body.data.created).toBeDefined();
      expect(body.data.lastModified).toBeDefined();
      expect(body.data.password).toBeUndefined();
    })
  });


  it('Test register user with exists mobile phone number should fail', function (done) {
    reqOption.url += '/users';
    reqOption.body = newUser;
    request.post(reqOption, function (error, response, body) {
      done();
      expect(response.statusCode).toEqual(409);
      expect(body.error).toBeDefined();
    })
  });

  it('Test login success', function (done) {
    var user = {mobile: mockMobile, password: 'pass'};
    reqOption.url += '/login';
    reqOption.body = user;
    request.post(reqOption, function (error, response, body) {
      done();
      expect(response.statusCode).toEqual(200);
      expect(body.data._id).toBeDefined();
    });
  });

  it('Test login failed', function (done) {
    var user = {mobile: mockMobile, password: 'wrong pass'};
    reqOption.url += '/login';
    reqOption.body = user;
    request.post(reqOption, function (error, response, body) {
      done();
      expect(response.statusCode).toEqual(401);
      expect(body.error).toBeDefined();
    });
  });
});
