'use strict';

var _ = require('lodash');

var decodeKey = function (key) {
  return key.replace(/\uff0e/g, '.').replace(/\uff04/g, '$').replace(/\\\\/g, '\\');
};


/**
 * package from repository oradbpackage
 * - definition aggregates all PackageVersionDefinitions
 * - it is stored only in repository
 * @constructor
 */
function PackageDefinition (packageDefinition) {
  var self = this;

  //console.log(packageDefinition);

  _.assign(self, packageDefinition);

  // TODO: fix time keys - move to server?
  _.map(self.time, function (value, key) {
    if (decodeKey(key) !== key) {
      self.time[decodeKey(key)] = value;
      delete self.time[key];
    }
  });

  _.map(self.versionSubdocuments, function (value, key) {
    if (decodeKey(key) !== key) {
      self.versionSubdocuments[decodeKey(key)] = value;
      delete self.versionSubdocuments[key];
    }
  });

  // TODO: sort self.versions using lodash + semver
  // TODO: sort self.time using lodash + semver

  return self;
}

/**
 *
 * @type {PackageDefinition}
 */
module.exports = PackageDefinition;
