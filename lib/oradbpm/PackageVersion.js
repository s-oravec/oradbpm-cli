'use strict';

var _ = require('lodash');

/**
 * loaded from file oradb_package.json
 * contains information only about specific version
 *
 * @param packageVersion parsed JSON
 * @returns {PackageVersion}
 * @constructor
 *
 */
function PackageVersion(packageVersion) {
  var self = this;

  _.assign(self, packageVersion);

  // optional params
  self.keywords = self.keywords || [];
  self.maintainers = self.maintainers || {};
  self.dependencies = self.dependencies || {};
  self.devDependencies = self.devDependencies || {};

  return self;
}

/**
 *
 * @type {PackageVersion}
 */
module.exports = PackageVersion;
