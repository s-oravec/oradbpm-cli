'use strict';

var _ = require('lodash');
var PackageDependency = require('./package-dependency.model');
var semver = require('semver');
var ValidationFunctionFactory = require('oradbpm-package-schema');
var validate = ValidationFunctionFactory({
  allErrors: false,
  verbose: true
});

function ValidationError(message, exitCode) {
  this.name = 'ValidationError';
  this.message = message;
  this.exitCode = exitCode || 1;
}

// TODO: validate against schema
var validatePackage = function (packageVersionDefinition) {

  if (
    semver.valid(packageVersionDefinition.version, true) === null ||
    semver.clean(packageVersionDefinition.version) !== packageVersionDefinition.version
  ) {
    throw new ValidationError('Package version is invalid.');
  }

  if (packageVersionDefinition.language !== 'plsql' && packageVersionDefinition.language !== 'sqlplus') {
    // console.log('ValidationError: ', packageVersionDefinition);
    throw new ValidationError('Package language "' + packageVersionDefinition.language + '" is invalid.');
  }
};

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

  // HACK - FIXME
  if (packageVersionDefinition.name !== '<main>') {
    // TODO: move to server
    self.language = self.language || self.lang;
    delete self.lang;
    delete self._id;
    delete self.publisherId;

    var valid = validate(self);
    if (!valid) {
      var message = 'WARNING: path:['+validate.errors[0].dataPath+'] data:['+validate.errors[0].data+'] ' + validate.errors[0].message;
      throw new ValidationError(message);
    }
    // validatePackage(self);
  }

  // optional params
  self.keywords = self.keywords || [];

  self.maintainers = self.maintainers || {};
  // unparsed
  self.dependencies = self.dependencies || {};

  // parsed dependencies - PackageDependency objects
  self.parsedDependencies = _.reduce(self.dependencies, function (acc, value, key) {
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
