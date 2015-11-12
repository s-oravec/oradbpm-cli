'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var semver = require('semver');

/**
 * represents DB schema
 * contains proposals for deployment of packages
 * contains resolutions for deployment of packages
 * db_schema_name - schemaNameBase_version
 * TODO: db_schema_name should be defined in oradb_package.json
 * @constructor
 * @param schemaNameBase
 * @param version
 * @return {DatabaseSchema}
 */
function DatabaseSchema(schemaNameBase, version) {
  var self = this;
  self.schemaNameBase = schemaNameBase;
  self.version = version;
  self.packagesProposal = {};
  self.packagesResolution = {};
  return self;
}

DatabaseSchema.prototype.addProposal = function (packageVersionDeployment) {
  var self = this;
  if (packageVersionDeployment.packageVersionDefinition.name !== '<main>') {
    var packageProposals = self.packagesProposal[packageVersionDeployment.packageVersionDefinition.name] || [];
    packageProposals.push(packageVersionDeployment);
    self.packagesProposal[packageVersionDeployment.packageVersionDefinition.name] = packageProposals;
  }
  return self;
};

DatabaseSchema.prototype.addResolution = function (packageVersionDeployment) {
  var self = this;
  self.packagesResolution[packageVersionDeployment.packageVersionDefinition.name] = packageVersionDeployment;
  return self;
};

DatabaseSchema.prototype.autoResolveConflictsWithLatest = function (options) {
  var self = this;
  // autoresolve with latest
  _.forEach(self.packagesProposal, function (packageVersionsDeployment, name) {
    // collect version and sort them
    var versions = _.pluck(packageVersionsDeployment, 'packageVersionDefinition.version').sort(semver.rcompare);
    // pick last and add it to resolution
    var packageVersionDeployment = _.find(packageVersionsDeployment, function (packageVersionDeployment) {
      return packageVersionDeployment.packageVersionDefinition.version === versions[0];
    });
    self.addResolution(packageVersionDeployment);
  });
  return Bluebird.resolve();
};

DatabaseSchema.prototype.resolveConflicts = function (options) {
  // TODO: --autoresolve-latest as option
  // TODO: implement interactive conflict resolution
  // TODO: --no-interactive as option
  // TODO: default is --interactive
  return this.autoResolveConflictsWithLatest();
};

DatabaseSchema.prototype.getDbSchemaName = function () {
  // TODO: add validation - each version number part is 1-2 digits
  // TODO: this validation has to be part of publish/tag/inc-version
  if (this.schemaNameBase === '<main>') return this.schemaNameBase;
  return (this.schemaNameBase + '_' + this.version).toUpperCase().replace(/[^\w\d]/g, '_');
};

// TODO: move to controller
DatabaseSchema.prototype.logSchema = function () {
  var self = this;
  var result = {
    db_schema: self.getDbSchemaName()
  };
  // TODO: configurable dependency display - default off
  // TODO: add dependency path - where dependency comes from
  _.forEach(self.packagesResolution, function (packageVersionDeployment) {
    result.packages = result.packages || {};
    result.packages[packageVersionDeployment.packageVersionDefinition.name] = {
      version: packageVersionDeployment.packageVersionDefinition.version,
      fromDependency: packageVersionDeployment.dependency.getDependencyLiteral()
    };
  });
  return result;
};

module.exports = DatabaseSchema;
