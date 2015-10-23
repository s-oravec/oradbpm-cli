'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var repoMock = require('./mock/PackageRepositoryService');
var SimplePackageRepositoryData = require('./mock/data/SimplePackageRepository').data;

var PackageDependencyTree = require('../lib/oradbpm/PackageDependencyTree');
var PackageVersion = require('../lib/oradbpm/PackageVersion');

describe('PackageDependencyTree', function () {

  var packageRepositoryService = repoMock.PackageRepositoryServiceFactory();

  before(function () {
    packageRepositoryService.setData(SimplePackageRepositoryData);
  });

  it('init tree for package with no dependency works', function () {
    var dt = new PackageDependencyTree(packageRepositoryService);
    return dt.initWithPackageVersion(new PackageVersion({
      name: 'foo',
      version: '0.0.1'
    }))
      .should.be.eventually.fulfilled;
  });

  it('init tree for package with simple dependency works', function () {
    var dt = new PackageDependencyTree(packageRepositoryService);
    return dt.initWithPackageVersion(new PackageVersion({
      name: 'foo',
      version: '0.0.1',
      dependencies: {baz: '1.0.0'}
    }))
      .should.be.eventually.fulfilled;
  });

  it('init tree for package with invalid dependency throws', function () {
    var dt = new PackageDependencyTree(packageRepositoryService);
    return dt.initWithPackageVersion(new PackageVersion({
      name: 'foo',
      version: '0.0.1',
      dependencies: {foo: '0.0.1'}
    }))
      .should.be.eventually.rejected;
  });

  it('init tree for package with dependency on nonexistent package throws', function () {
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
