'use strict';

var chai = require('chai');
chai.should();

var DatabaseSchema = require('../../../lib/oradbpm-client/model/database-schema.model');
var PackageVersionDeployment = require('../../../lib/oradbpm-client/model/package-version-deployment.model');
var PackageVersionDefinition = require('../../../lib/oradbpm-client/model/package-version-definition.model');

var packageVersionDefinition1 = new PackageVersionDefinition({
  "name": "db-schema-package-name",
  "version": "0.0.1",
  "description": "db-schema-package-name",
  "repository": {
    "type": "git",
    "url": "test/tmp/inc-version/git-repo"
  },
  "license": "MIT"
});

var packageVersionDefinition2 = new PackageVersionDefinition({
  "name": "db-schema-package-name",
  "version": "0.0.2",
  "description": "db-schema-package-name",
  "repository": {
    "type": "git",
    "url": "test/tmp/inc-version/git-repo"
  },
  "license": "MIT"
});

describe('DatabaseSchema', function () {
  it('constructor should create instance', function () {
    var dbSchema = new DatabaseSchema('PETE_010000');
    // jshint expr: true
    (dbSchema instanceof DatabaseSchema).should.be.true;
    dbSchema.schemaName.should.be.equal('PETE_010000');
  });

  it('addProposal should add proposal', function () {
    var dbSchema = new DatabaseSchema('PETE_010000');
    var packageVersionDeployment;
    // first
    packageVersionDeployment = new PackageVersionDeployment(packageVersionDefinition1);
    dbSchema.addProposal(packageVersionDeployment);
    dbSchema.packagesProposal.should.have.ownProperty(packageVersionDeployment.name);
    dbSchema.packagesProposal[packageVersionDeployment.name].length.should.be.equal(1);
    dbSchema.packagesProposal[packageVersionDeployment.name][0].should.be.deep.equal(packageVersionDeployment);
    // second
    packageVersionDeployment = new PackageVersionDeployment(packageVersionDefinition2);
    dbSchema.addProposal(packageVersionDeployment);
    dbSchema.packagesProposal.should.have.ownProperty(packageVersionDeployment.name);
    dbSchema.packagesProposal[packageVersionDeployment.name].length.should.be.equal(2);
    dbSchema.packagesProposal[packageVersionDeployment.name][1].should.be.deep.equal(packageVersionDeployment);
  });

  it('addResolution should add resolution', function () {
    var dbSchema = new DatabaseSchema('PETE_010000');
    var packageVersionDeployment;
    packageVersionDeployment = new PackageVersionDeployment(packageVersionDefinition1);
    dbSchema.addResolution(packageVersionDeployment);
    dbSchema.packagesResolution.should.have.ownProperty(packageVersionDeployment.name);
    dbSchema.packagesResolution[packageVersionDeployment.name].should.be.deep.equal(packageVersionDeployment);
  });

  it('second addResolution of same package should replace previous resolution', function () {
    var dbSchema = new DatabaseSchema('PETE_010000');
    var packageVersionDeployment = new PackageVersionDeployment(packageVersionDefinition1);
    // first
    dbSchema.addResolution(packageVersionDeployment);
    dbSchema.packagesResolution.should.have.ownProperty(packageVersionDeployment.name);
    dbSchema.packagesResolution[packageVersionDeployment.name].should.be.deep.equal(packageVersionDeployment);
    // second
    packageVersionDeployment = new PackageVersionDeployment(packageVersionDefinition2);
    dbSchema.addResolution(packageVersionDeployment);
    dbSchema.packagesResolution.should.have.ownProperty(packageVersionDeployment.name);
    dbSchema.packagesResolution[packageVersionDeployment.name].should.be.deep.equal(packageVersionDeployment);
  });

});
