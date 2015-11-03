'use strict';

var _ = require('lodash');
var PackageDependency = require('./package-dependency.model');

/**
 *
 * Package definition as of specified exact version
 * - either loaded from file oradb_package.json
 * - or from PackageDefinition.versionDefinitions
 *
 * contains information only about specific version
 *
 * @param packageVersionDefinition
 * @returns {*}
 * @constructor
 */
function PackageVersionDefinition(packageVersionDefinition) {
  var self = this;

  _.assign(self, packageVersionDefinition);

  // optional params
  self.keywords = self.keywords || [];
  self.maintainers = self.maintainers || {};

  // raw
  self.dependencies = self.dependencies || {};
  // create PackageDependency objects
  self.dependenciesObjects = _.reduce(self.dependencies, function (acc, value, key) {
    acc[key] = new PackageDependency(key, value);
    return acc;
  }, {});

  // raw
  self.devDependencies = self.devDependencies || {};
  // create objects
  self.devDependenciesObjects = _.reduce(self.devDependencies, function (acc, value, key) {
    acc[key] = new PackageDependency(key, value);
    return acc;
  }, {});

  return self;
}

/**
 *
 * @type {PackageVersionDefinition}
 */
module.exports = PackageVersionDefinition;
