'use strict';

var _ = require('lodash');
var PackageVersionDefinition = require('./package-version-definition.model');

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

  _.assign(self, packageDefinition);

  // TODO: fix time keys - move to server?
  _.map(self.time, function (value, key) {
    if (decodeKey(key) !== key) {
      self.time[decodeKey(key)] = value;
      delete self.time[key];
    }
  });

  _.map(self.packageVersionDefinitions, function (value, key) {
    if (decodeKey(key) !== key) {
      self.packageVersionDefinitions[decodeKey(key)] = new PackageVersionDefinition(value);
      //self.packageVersionDefinitions[decodeKey(key)] = value;
      delete self.packageVersionDefinitions[key];
    }
  });

  // TODO: move to server
  self.language = self.lang;

  // TODO: move to server
  delete self.lang;
  delete self.__v;
  delete self._id;
  delete self.authorId;

  // TODO: sort self.versions using lodash + semver
  // TODO: sort self.time using lodash + semver

  //console.log(self);

  return self;
}

/**
 *
 * @type {PackageDefinition}
 */
module.exports = PackageDefinition;
