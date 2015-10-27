'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var Bluebird = require('bluebird');
var PackageRepositoryService = require('./../../../lib/oradbpm.client/service/PackageRepositoryService.js');
var fs = Bluebird.promisifyAll(require('fs'));
var debug = require('debug')('oradbpm:PackageRepositoryService:test');

describe('PackageRepositoryService', function () {

  var packageRepositoryService;

  before(function () {
    packageRepositoryService = PackageRepositoryService.PackageRepositoryServiceFactory();
  });

  it('should instantiate correctly', function () {
    packageRepositoryService.should.have.property('search');
    packageRepositoryService.should.have.property('get');
    packageRepositoryService.should.have.property('publish');
    packageRepositoryService.should.have.property('login');
  });

});
