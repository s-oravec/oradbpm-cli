'use strict';

var chai = require('chai');
chai.should();

var DatabaseSchema = require('../../../lib/oradbpm-client/model/database-schema.model');
var PackageVersionDeployment = require('../../../lib/oradbpm-client/model/package-version-deployment.model');
var PackageVersionDefinition = require('../../../lib/oradbpm-client/model/package-version-definition.model');
var PackageDependencyTreeNode = require('../../../lib/oradbpm-client/model/package-dependency-tree.model').PackageDependencyTreeNode;
var PackageDependencyTreeRoot = require('../../../lib/oradbpm-client/model/package-dependency-tree.model').PackageDependencyTreeRoot;
var PackageDefinition = require('../../../lib/oradbpm-client/model/package-definition.model.js');
var PackageDependency = require('../../../lib/oradbpm-client/model/package-dependency.model');

describe('DatabaseSchema', function () {

  var packageDefinition;
  var mainPackageVersionDefinition;
  var packageDependencyTreeRoot;

  before(function () {
    packageDefinition = new PackageDefinition({
      name: 'db_schema_package_name',
      version: '0.0.2',
      language: 'plsql',
      description: "some package",
      license: "MIT",
      tags: {
        latest: '0.0.2'
      },
      versions: ['0.0.1', '0.0.2'],
      packageVersionDefinitions: {
        '0.0.1': {
          name: 'db_schema_package_name',
          version: '0.0.1',
          language: 'plsql',
          description: "some package",
          license: "MIT"
        },
        '0.0.2': {
          name: 'db_schema_package_name',
          version: '0.0.2',
          language: 'plsql',
          description: "some package",
          license: "MIT"
        }
      }
    });
  });

  beforeEach(function () {
    mainPackageVersionDefinition = new PackageVersionDefinition({
      name: 'anonymous',
      version: '0.0.1',
      language: "plsql",
      description: "some package",
      license: "MIT"
    });
    packageDependencyTreeRoot = new PackageDependencyTreeRoot(mainPackageVersionDefinition);
  });


  it('constructor should create instance', function () {
    var dbSchema = new DatabaseSchema('pete', '0.0.1');
    dbSchema.should.be.instanceOf(DatabaseSchema);
    dbSchema.schemaNameBase.should.be.equal('pete');
  });

  it('addProposal should add proposal', function () {
    var dbSchema = new DatabaseSchema('pete', '0.0.1');
    var packageVersionDeployment;
    var packageDependency1 = new PackageDependency('db_schema_package_name', '0.0.1');
    var packageDependency2 = new PackageDependency('db_schema_package_name', '0.0.2');
    // first
    packageVersionDeployment = new PackageVersionDeployment(new PackageDependencyTreeNode(packageDependencyTreeRoot, packageDependency1, packageDefinition));
    dbSchema.addProposal(packageVersionDeployment);
    dbSchema.packagesProposal.should.have.ownProperty(packageVersionDeployment.packageVersionDefinition.name);
    dbSchema.packagesProposal[packageVersionDeployment.packageVersionDefinition.name].length.should.be.equal(1);
    dbSchema.packagesProposal[packageVersionDeployment.packageVersionDefinition.name][0].should.be.deep.equal(packageVersionDeployment);
    // second
    packageVersionDeployment = new PackageVersionDeployment(new PackageDependencyTreeNode(packageDependencyTreeRoot, packageDependency2, packageDefinition));
    dbSchema.addProposal(packageVersionDeployment);
    dbSchema.packagesProposal.should.have.ownProperty(packageVersionDeployment.packageVersionDefinition.name);
    dbSchema.packagesProposal[packageVersionDeployment.packageVersionDefinition.name].length.should.be.equal(2);
    dbSchema.packagesProposal[packageVersionDeployment.packageVersionDefinition.name][1].should.be.deep.equal(packageVersionDeployment);
  });

  it('addResolution should add resolution', function () {
    var dbSchema = new DatabaseSchema('pete', '0.0.1');
    var packageVersionDeployment;
    var packageDependency1 = new PackageDependency('db_schema_package_name', '0.0.1');
    //
    packageVersionDeployment = new PackageVersionDeployment(new PackageDependencyTreeNode(packageDependencyTreeRoot, packageDependency1, packageDefinition));
    dbSchema.addResolution(packageVersionDeployment);
    dbSchema.packagesResolution.should.have.ownProperty(packageVersionDeployment.packageVersionDefinition.name);
    dbSchema.packagesResolution[packageVersionDeployment.packageVersionDefinition.name].should.be.deep.equal(packageVersionDeployment);
  });

  it('second addResolution of same package should replace previous resolution', function () {
    var dbSchema = new DatabaseSchema('pete', '0.0.1');
    var packageVersionDeployment;
    // first
    var packageDependency1 = new PackageDependency('db_schema_package_name', '0.0.1');
    var packageDependency2 = new PackageDependency('db_schema_package_name', '0.0.2');
    packageVersionDeployment = new PackageVersionDeployment(new PackageDependencyTreeNode(packageDependencyTreeRoot, packageDependency1, packageDefinition));
    dbSchema.addResolution(packageVersionDeployment);
    dbSchema.packagesResolution.should.have.ownProperty(packageVersionDeployment.packageVersionDefinition.name);
    dbSchema.packagesResolution[packageVersionDeployment.packageVersionDefinition.name].should.be.deep.equal(packageVersionDeployment);
    // second
    packageVersionDeployment = new PackageVersionDeployment(new PackageDependencyTreeNode(packageDependencyTreeRoot, packageDependency2, packageDefinition));
    dbSchema.addResolution(packageVersionDeployment);
    dbSchema.packagesResolution.should.have.ownProperty(packageVersionDeployment.packageVersionDefinition.name);
    dbSchema.packagesResolution[packageVersionDeployment.packageVersionDefinition.name].should.be.deep.equal(packageVersionDeployment);
  });

  it('resolveConflicts without options should resolve with latest', function () {
    var dbSchema = new DatabaseSchema('pete', '0.0.1');
    var packageVersionDeployment;
    var packageDependency1 = new PackageDependency('db_schema_package_name', '0.0.1');
    var packageDependency2 = new PackageDependency('db_schema_package_name', '0.0.2');
    // first
    packageVersionDeployment = new PackageVersionDeployment(new PackageDependencyTreeNode(packageDependencyTreeRoot, packageDependency1, packageDefinition));
    dbSchema.addProposal(packageVersionDeployment);
    // second
    packageVersionDeployment = new PackageVersionDeployment(new PackageDependencyTreeNode(packageDependencyTreeRoot, packageDependency2, packageDefinition));
    dbSchema.addProposal(packageVersionDeployment);
    //
    dbSchema.resolveConflicts();
    //
    dbSchema.packagesResolution['db_schema_package_name'].packageVersionDefinition.version.should.equal('0.0.2');
  });

});

