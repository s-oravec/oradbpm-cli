'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var PackageDependencyTreeModel = require('../../../lib/oradbpm-client/model/package-dependency-tree.model.js');
var PackageDependency = require('../../../lib/oradbpm-client/model/package-dependency.model.js');
var PackageVersionDefinition = require('../../../lib/oradbpm-client/model/package-version-definition.model.js');
var PackageDefinition = require('../../../lib/oradbpm-client/model/package-definition.model.js');

describe('PackageDependencyTreeRoot', function () {

  var packageVersionDefinition;

  before(function () {
    packageVersionDefinition = new PackageVersionDefinition({
      name: 'anonymous',
      version: '0.0.1',
      language: "plsql"
    });
  });

  it('constructor creates instance', function () {
    var dependencyTreeRoot = new PackageDependencyTreeModel.PackageDependencyTreeRoot(packageVersionDefinition);
    // jshint expr: true
    (dependencyTreeRoot instanceof PackageDependencyTreeModel.PackageDependencyTreeRoot).should.be.true;
  });

});

describe('PackageDependencyTreeNode', function () {

  var mainPackageVersionDefinition;
  var packageDependencyTreeRoot;
  var sqlsnDependency;
  var sqlsnCoreDependency;
  var sqlsnCoreLocalDependency;
  var sqlsnPackageDefinition;
  var sqlsnCorePackageDefinition;

  before(function () {
    mainPackageVersionDefinition = new PackageVersionDefinition({
      name: 'anonymous',
      version: '0.0.1',
      language: "plsql"
    });
    sqlsnCorePackageDefinition = new PackageDefinition({
      name: 'sqlsn-core',
      version: '0.0.1',
      language: 'sqlplus',
      tags: {
        latest: '0.0.1'
      },
      versions: ['0.0.1'],
      packageVersionDefinitions: {
        '0.0.1': {
          name: 'sqlsn-core',
          version: '0.0.1',
          language: 'sqlplus'
        }
      }
    });
    sqlsnPackageDefinition = new PackageDefinition({
      name: 'sqlsn',
      version: '0.0.1',
      language: 'sqlplus',
      tags: {
        latest: '0.0.1'
      },
      versions: ['0.0.1'],
      packageVersionDefinitions: {
        '0.0.1': {
          name: 'sqlsn',
          version: '0.0.1',
          language: 'sqlplus',
          dependencies: {
            'sqlsn-core' : '0.0.1'
          }
        }
      }
    });
    sqlsnDependency = new PackageDependency('sqlsn', '0.0.1', false);
    sqlsnCoreDependency = new PackageDependency('sqlsn-core', '0.0.1', false);
    sqlsnCoreLocalDependency = new PackageDependency('sqlsn-core', {version: '0.0.1', local: true});
  });

  beforeEach(function () {
    packageDependencyTreeRoot = new PackageDependencyTreeModel.PackageDependencyTreeRoot(mainPackageVersionDefinition);
  });

  it('constructor creates instance', function () {
    packageDependencyTreeRoot.mergeDependencies([sqlsnCoreDependency], {});
    var dependencyTreeNode = new PackageDependencyTreeModel.PackageDependencyTreeNode(packageDependencyTreeRoot, sqlsnCoreDependency, sqlsnCorePackageDefinition);
    // jshint expr: true
    (dependencyTreeNode instanceof PackageDependencyTreeModel.PackageDependencyTreeNode).should.be.true;
  });

  it('nearest global of root is root', function () {
    var nearestGlobalAncestor = packageDependencyTreeRoot.getNearestGlobal();
    nearestGlobalAncestor.should.equal(packageDependencyTreeRoot);
  });

  it('nearest global of local package is its parent\'s nearest global', function () {
    packageDependencyTreeRoot.mergeDependencies([sqlsnDependency], {});
    var sqlsnCoreTreeNode = new PackageDependencyTreeModel.PackageDependencyTreeNode(packageDependencyTreeRoot, sqlsnCoreLocalDependency, sqlsnCorePackageDefinition);
    sqlsnCoreTreeNode.getNearestGlobal().should.equal(sqlsnCoreTreeNode.parentNode.getNearestGlobal());
  });

  it('nearest global of non-root package is itself', function () {
    packageDependencyTreeRoot.mergeDependencies([sqlsnDependency], {});
    var sqlsnCoreTreeNode = new PackageDependencyTreeModel.PackageDependencyTreeNode(packageDependencyTreeRoot, sqlsnCoreDependency, sqlsnCorePackageDefinition);
    sqlsnCoreTreeNode.getNearestGlobal().should.equal(sqlsnCoreTreeNode);
  });

});
