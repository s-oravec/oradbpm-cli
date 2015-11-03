'use strict';

var util = require('util');
var _ = require('lodash');
var PackageVersionDefinition = require('./package-version-definition.model');

/**
 *
 * @param
 * @return {PackageVersionDeployment}
 * @constructor
 */
function PackageVersionDeployment(packageVersionDefinition) {
  var self = this;
  _.extend(self, packageVersionDefinition);
  self.fromDependencies = [];
  return self;
}

PackageVersionDeployment.prototype.addDependency = function (packageDependency) {
  var self = this;
  self.fromDependencies.push(packageDependency);
  return self;
};

util.inherits(PackageVersionDeployment, PackageVersionDefinition);

/**
 *
 * @type {PackageVersionDeployment}
 */
module.exports = PackageVersionDeployment;
