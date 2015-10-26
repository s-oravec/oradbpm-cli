'use strict';

/**
 * PackageDependency
 * @param name
 *  reserved package names
 *    - local
 *    - version
 * @param version semver version | range | tag | { version: <version> | <range> | <tag>, local : true | false }
 * @returns {PackageDependency}
 * @constructor
 */
function PackageDependency(name, version) {
  var self = this;
  if (!name) {
    throw new Error('PackageDependency.name should be not empty!');
  }
  // check reserved package names
  if (name === 'local' || name === 'version') {
    throw new Error('PackageDependency.name %s is reserved.', name);
  }
  self.name = name;
  if (typeof version === 'string') {
    // dependency in form name : version
    self.version = version;
    self.local = false;
  } else if (typeof version === 'object') {
    // dependency in form <name> : { version: <version>, local: <local> }
    self.version = version.version;
    self.local = version.local || false;
  }
  if (!self.version) {
    throw new Error('PackageDependency.version should be not empty!');
  }
  return self;
}

/**
 * PackageDependency
 * @type {PackageDependency}
 */
module.exports = PackageDependency;
