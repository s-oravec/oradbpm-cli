'use strict';

var semver = require('semver');

/**
 * PackageVersionIdentifier - created as a result of dependency resolution
 * @param name
 * @param version - exact version number
 * @returns {PackageVersionIdentifier}
 * @constructor
 */
function PackageVersionIdentifier (name, version) {
  var self = this;
  if (!name) {
    throw new Error('PackageVersionIdentifier.name should be not empty!');
  }
  self.name = name;
  self.version = semver.valid(version);
  if (!self.version) {
    throw new Error('PackageVersionIdentifier.version is invalid!');
  }
  return self;
}

/**
 * PackageVersionIdentifier
 * @type {PackageVersionIdentifier}
 */
module.exports = PackageVersionIdentifier;
