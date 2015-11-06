'use strict';

var chai = require('chai');
chai.should();

var OraDBPMClient = require('../lib/oradbpm-client');

describe('oradbpm-client', function () {

  var oraDBPMClient;

  before(function () {
    oraDBPMClient = new OraDBPMClient();
  });

  it('should define oradbpm-client.get', function () {
    oraDBPMClient.hasOwnProperty('get');
    (typeof oraDBPMClient.get).should.be.equal('function');
  });
  it('should define oradbpm-client.inc-version', function () {
    oraDBPMClient.hasOwnProperty('inc-version');
    (typeof oraDBPMClient['inc-version']).should.be.equal('function');
  });

  it('should define oradbpm-client.login', function () {
    oraDBPMClient.hasOwnProperty('login');
    (typeof oraDBPMClient.login).should.be.equal('function');
  });

  it('should define oradbpm-client.logout', function () {
    oraDBPMClient.hasOwnProperty('logout');
    (typeof oraDBPMClient.logout).should.be.equal('function');
  });

  it('should define oradbpm-client.publish', function () {
    oraDBPMClient.hasOwnProperty('publish');
    (typeof oraDBPMClient.publish).should.be.equal('function');
  });

  it('should define oradbpm-client.search', function () {
    oraDBPMClient.hasOwnProperty('search');
    (typeof oraDBPMClient.search).should.be.equal('function');
  });

  it('should define oradbpm-client.version', function () {
    oraDBPMClient.hasOwnProperty('version');
    (typeof oraDBPMClient.version).should.be.equal('function');
  });

  it('should define oradbpm-client.view', function () {
    oraDBPMClient.hasOwnProperty('view');
    (typeof oraDBPMClient.view).should.be.equal('function');
  });

  it('should define oradbpm-client.whoami', function () {
    oraDBPMClient.hasOwnProperty('whoami');
    (typeof oraDBPMClient.whoami).should.be.equal('function');
  });

});
