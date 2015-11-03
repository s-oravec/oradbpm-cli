'use strict';

/**
 * represents DB schema
 * contains proposals for deployment of packages
 * contains resolutions for deployment of packages
 * - schemaName = package_MXXYYZZ for (semver range - M - ^ = c; ~ = t; # = h, XX, YY, ZZ - semver version numbers)
 * TODO schemaName should be defined in oradb_package.json
 * @constructor
 */
function DatabaseSchema (schemaName) {
  var self = this;
  self.schemaName = schemaName;
  self.packagesProposal = {};
  self.packagesResolution = {};
  return self;
}

DatabaseSchema.prototype.addProposal = function (packageVersionDeployment) {
  var self = this;
  var packageProposals = self.packagesProposal[packageVersionDeployment.name] || [];
  packageProposals.push(packageVersionDeployment);
  self.packagesProposal[packageVersionDeployment.name] = packageProposals;
  return self;
};

DatabaseSchema.prototype.addResolution = function (packageVersionDeployment) {
  var self = this;
  self.packagesResolution[packageVersionDeployment.name] = packageVersionDeployment;
  return self;
};

module.exports = DatabaseSchema;
