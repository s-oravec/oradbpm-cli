'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var repoMock = require('./../../mock/PackageRepositoryService');
var SimplePackageRepositoryData = require('./../../mock/data/SimplePackageRepository').data;

var PackageDependencyTree = require('../../../lib/oradbpm-client/model/package-dependency-tree.model.js');
var PackageVersion = require('../../../lib/oradbpm-client/model/package-version-definition.model.js');

describe.skip('PackageDependencyTree', function () {

  var packageRepositoryService = repoMock.PackageRepositoryServiceFactory();

  it('init tree for package with no dependency works', function () {
    packageRepositoryService.setData(SimplePackageRepositoryData);
    var dt = new PackageDependencyTree(packageRepositoryService);
    return dt.initWithPackageVersion(new PackageVersion({
      name: 'foo',
      version: '0.0.1'
    }))
      .should.be.eventually.fulfilled;
  });

  it('init tree for package with simple dependency works', function () {
    packageRepositoryService.setData(SimplePackageRepositoryData);
    var dt = new PackageDependencyTree(packageRepositoryService);
    return dt.initWithPackageVersion(new PackageVersion({
      name: 'foo',
      version: '0.0.1',
      dependencies: {baz: '1.0.0'}
    }))
      .should.be.eventually.fulfilled;
  });

  it('init tree for package with invalid dependency throws', function () {
    packageRepositoryService.setData(SimplePackageRepositoryData);
    var dt = new PackageDependencyTree(packageRepositoryService);
    return dt.initWithPackageVersion(new PackageVersion({
      name: 'foo',
      version: '0.0.1',
      dependencies: {foo: '0.0.1'}
    }))
      .should.be.eventually.rejected;
  });

  it('init tree for package with dependency on nonexistent package throws', function () {
    packageRepositoryService.setData(SimplePackageRepositoryData);
    var dt = new PackageDependencyTree(packageRepositoryService);
    return dt.initWithPackageVersion(new PackageVersion({
      name: 'foo',
      version: '0.0.1',
      devDependencies: {
        foo: '0.0.1'
      }
    }))
      .should.be.eventually.rejectedWith(repoMock.PackageNotFound('foo'));
  });

});
