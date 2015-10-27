'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var Bluebird = require('bluebird');
var LocalConfigFileService = require('./../../../lib/oradbpm.client/service/LocalConfigFileService.js');
var fs = Bluebird.promisifyAll(require('fs'));
var debug = require('debug')('oradbpm:service:local-config:test');

describe('LocalConfigFileService', function () {

  var localConfigFileService;

  before(function () {
    localConfigFileService = LocalConfigFileService.LocalConfigFileServiceFactory();
  });

  it('should instantiate correctly', function () {
    localConfigFileService.should.have.property('read');
    localConfigFileService.should.have.property('write');
  });

  it('it should be able to read what has been written in there', function () {
    return localConfigFileService
      .write({username: 'tradaa'})
      .then(localConfigFileService.read)
      .then(function (data) {
        data.username.should.equal('tradaa');
        return data;
      })
      .should.eventually.be.fulfilled;
  });

  it('should resolve with empty object when file not exists', function () {
    return fs.unlinkAsync(__dirname + '/../../../config/local.json')
      .then(localConfigFileService.read)
      .then(function (data) {
        data.should.deep.equal({});
      })
      .should.be.eventually.fulfilled;
  });

});
