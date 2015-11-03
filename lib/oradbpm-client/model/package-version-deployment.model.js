'use strict';

var util = require('util');
var PackageVersionDefinition = require('package-version-definition.model');

/**
 *
 * @param fromDependencies
 * @return {PackageVersionDeployment}
 * @constructor
 */
function PackageVersionDeployment(fromDependencies) {
  var self = this;
  self.fromDependencies = [];
  return self;
}

util.inherits(PackageVersionDeployment, PackageVersionDefinition);

/**
 *
 * @type {PackageVersionDeployment}
 */
module.exports = PackageVersionDeployment;
