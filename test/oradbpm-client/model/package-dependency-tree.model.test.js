'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var PackageDependencyTreeModel = require('../../../lib/oradbpm-client/model/package-dependency-tree.model');
var PackageDependency = require('../../../lib/oradbpm-client/model/package-dependency.model');
var PackageVersionDefinition = require('../../../lib/oradbpm-client/model/package-version-definition.model');
var PackageDefinition = require('../../../lib/oradbpm-client/model/package-definition.model');

describe('PackageDependencyTreeRoot', function () {

  var packageVersionDefinition;

  before(function () {
    packageVersionDefinition = new PackageVersionDefinition({
      name: 'anonymous',
      version: '0.0.1',
      language: 'plsql'
    });
  });

  it('constructor creates instance', function () {
    var dependencyTreeRoot = new PackageDependencyTreeModel.PackageDependencyTreeRoot(packageVersionDefinition);
    dependencyTreeRoot.should.be.instanceOf(PackageDependencyTreeModel.PackageDependencyTreeRoot);
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
    sqlsnCorePackageDefinition = new PackageDefinition({
      name: 'sqlsn-core',
      version: '0.0.1',
      language: 'sqlplus',
      tags: {
        latest: '0.0.1',
        beta:   '0.0.1-beta'
      },
      versions: ['0.0.1', '0.0.1-beta'],
      packageVersionDefinitions: {
        '0.0.1': {
          name: 'sqlsn-core',
          version: '0.0.1',
          language: 'sqlplus'
        },
        '0.0.1-beta': {
          name: 'sqlsn-core',
          version: '0.0.1-beta',
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
    sqlsnCoreDependency = new PackageDependency('sqlsn-core', '0.0.1');
    sqlsnCoreLocalDependency = new PackageDependency('sqlsn-core', {version: '0.0.1', local: true});
  });

  beforeEach(function () {
    mainPackageVersionDefinition = new PackageVersionDefinition({
      name: 'anonymous',
      version: '0.0.1',
      language: "plsql"
    });
    packageDependencyTreeRoot = new PackageDependencyTreeModel.PackageDependencyTreeRoot(mainPackageVersionDefinition);
  });

  it('constructor creates instance', function () {
    packageDependencyTreeRoot.mergeDependencies([sqlsnCoreDependency], {});
    var dependencyTreeNode = new PackageDependencyTreeModel.PackageDependencyTreeNode(packageDependencyTreeRoot, sqlsnCoreDependency, sqlsnCorePackageDefinition);
    dependencyTreeNode.should.be.instanceOf(PackageDependencyTreeModel.PackageDependencyTreeNode);
  });

  it('constructor creates instance with tag dependency', function () {
    packageDependencyTreeRoot.mergeDependencies([sqlsnCoreDependency], {});
    var sqlsnCoreBetaDependency = new PackageDependency('sqlsn-core', 'beta');
    var dependencyTreeNode = new PackageDependencyTreeModel.PackageDependencyTreeNode(packageDependencyTreeRoot, sqlsnCoreBetaDependency, sqlsnCorePackageDefinition);
    dependencyTreeNode.should.be.instanceOf(PackageDependencyTreeModel.PackageDependencyTreeNode);
    dependencyTreeNode.packageVersionDefinition.version.should.be.equal('0.0.1-beta');
  });

  it('nearest global of root is root', function () {
    var nearestGlobalAncestor = packageDependencyTreeRoot.getNearestGlobal();
    nearestGlobalAncestor.should.equal(packageDependencyTreeRoot);
  });

  it('nearest global of local package is its parent\'s nearest global', function () {
    sqlsnDependency = new PackageDependency('sqlsn', '0.0.1');
    packageDependencyTreeRoot.mergeDependencies([sqlsnDependency], {});
    var sqlsnCoreTreeNode = new PackageDependencyTreeModel.PackageDependencyTreeNode(packageDependencyTreeRoot, sqlsnCoreLocalDependency, sqlsnCorePackageDefinition);
    sqlsnCoreTreeNode.getNearestGlobal().should.equal(sqlsnCoreTreeNode.parentNode.getNearestGlobal());
  });

  it('nearest global of non-root package is itself', function () {
    sqlsnDependency = new PackageDependency('sqlsn', '0.0.1');
    packageDependencyTreeRoot.mergeDependencies([sqlsnDependency], {});
    var sqlsnCoreTreeNode = new PackageDependencyTreeModel.PackageDependencyTreeNode(packageDependencyTreeRoot, sqlsnCoreDependency, sqlsnCorePackageDefinition);
    sqlsnCoreTreeNode.getNearestGlobal().should.equal(sqlsnCoreTreeNode);
  });

});
