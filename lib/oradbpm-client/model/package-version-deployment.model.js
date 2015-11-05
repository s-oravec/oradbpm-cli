'use strict';

var util = require('util');
var _ = require('lodash');
var PackageVersionDefinition = require('./package-version-definition.model');

/**
 *
 * @constructor
 * @param packageVersionDefinition
 * @param packageDependency
 * @return {PackageVersionDeployment}
 */
function PackageVersionDeployment(packageVersionDefinition, packageDependency) {
  var self = this;
  _.extend(self, packageVersionDefinition);
  self.dependency = packageDependency;
  return self;
}

util.inherits(PackageVersionDeployment, PackageVersionDefinition);

/**
 *
 * @type {PackageVersionDeployment}
 */
module.exports = PackageVersionDeployment;
