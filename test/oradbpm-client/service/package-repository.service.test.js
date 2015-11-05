'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var PackageRepositoryService = require('./../../../lib/oradbpm-client/service/package-repository.service.js');

describe('PackageRepositoryService', function () {

  var packageRepositoryService;

  before(function () {
    packageRepositoryService = PackageRepositoryService.PackageRepositoryServiceFactory();
  });

  it('construcotr should create instance', function () {
    (packageRepositoryService instanceof PackageRepositoryService).should.be.equal(true);
    packageRepositoryService.should.have.property('search');
    packageRepositoryService.should.have.property('get');
    packageRepositoryService.should.have.property('publish');
    packageRepositoryService.should.have.property('login');
  });

});
