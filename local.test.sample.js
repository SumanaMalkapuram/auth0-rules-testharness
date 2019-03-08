'use strict';

var expect = require('chai').expect;
var runInLocalSandbox = require('./local');
var nock = require('nock');

var user = {
  "email": "richard.seldon@auth0.com",
  "email_verified": true,
  "name": "Richard Seldon",
  "given_name": "Richard",
  "family_name": "Seldon",
  "created_at": "2017-02-22T07:52:40.990Z",
  "last_login": "2017-02-23T10:00:27.900Z",
  "logins_count": 4
};

var context = {
  "clientID": "wWXS5rz3asdfdfkzbCXho3zNPNv77c",
  "clientName": "My Auth0 Client",
  "connection": "MY-DB",
  "connectionStrategy": "auth0",
  "protocol": "oidc-basic-profile",
  "stats": {"loginsCount": 5}
};

var configuration = {
  requestBinUrl: 'http://requestbin.fullcontact.com/auth0-rule-test'
};


describe('auth0-requestbin', function () {
  var body = {
    'user': {'email': user.email, 'email_verified': user.email_verified},
    'context': {'clientID': context.clientID, 'connection': context.connection,
                'stats': context.stats}
  };
  var script = require('fs').readFileSync('./examples/requestbin.js');


  it('should post to request bin successfully', function (done) {
     nock(configuration.requestBinUrl).post('', body).reply(200);

      var callback = function (err, response, context) {
        expect(response).to.be.equal(user);
        done(err);
      }

      runInLocalSandbox(script, [user, context, callback], configuration);
    });

  it('should fail to post to request bin', function (done) {
    nock(configuration.requestBinUrl).post('', body).reply(500);

    var callback = function (err, response, context) {
      expect(err).to.be.null;
      done();
    };

    runInLocalSandbox(script, [user, context, callback], configuration);

  });
})
