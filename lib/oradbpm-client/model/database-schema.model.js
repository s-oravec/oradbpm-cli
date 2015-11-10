'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');

/**
 * represents DB schema
 * contains proposals for deployment of packages
 * contains resolutions for deployment of packages
 * - schemaNameBase = base part of schema name (package_MXXYYZZ for (semver range - M - ^ = c; ~ = t; # = h, XX, YY, ZZ - semver version numbers))
 * TODO: schemaNameBase should be defined in oradb_package.json
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

DatabaseSchema.prototype.resolveConflicts = function (options) {
  var self = this;
  // TODO: --autoresolve-latest as option
  // autoresolve with latest

  // TODO: FIXME!!!
  _.forEach(self.packagesProposal, function (packageVersionDeployment, name) {
    self.addResolution(packageVersionDeployment);
  });
  // TODO: implement interactive conflict resolution
  // --no-interactive as option
  // deafault is --interactive
  return Bluebird.resolve();
};

module.exports = DatabaseSchema;
