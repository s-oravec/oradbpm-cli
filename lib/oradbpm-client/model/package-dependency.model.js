'use strict';

var _ = require('lodash');
var debug = require('debug')('oradbpm:model:package-dependency');
var error = require('../common/error');
var semver = require('semver');
var util = require('util');

var PACKAGE = /^[a-z]+(-[0-9a-z]+)*$/;
var PACKAGE_VERSION = /^([a-z]+)(-[0-9a-z]+)*@(.+)$/;

// var gitUrlParse = require('git-url-parse');
//var GIT_USER_REPO = /([-\w]+)\/([-\w]+)/; - not implemented yet

/**
 *
 * @param message
 * @param exitCode
 * @constructor
 */
function PackageDependencyError(message, exitCode) {
  this.name = 'PackageDependencyError';
  this.message = message;
  this.exitCode = exitCode || 1;
}

util.inherits(PackageDependencyError, error.OraDBPMClientError);

/**
 *
 * @param version
 * @return {{}}
 */
var getValidVersion = function (version) {
  var result = {};
  if (semver.valid(version, true)) {
    result.type = 'version';
    result.versionLiteral = version;
    result.version = semver.valid(version, true);
  } else if (semver.validRange(version, true)) {
    result.type = 'versionRange';
    result.versionRangeLiteral = version;
    result.versionRange = semver.validRange(version, true);
  } else {
    result.type = 'tag';
    result.tag = version.trim();
  }
  return result;
};

/**
 *
 * @param pkg
 * @return {*}
 */
var parseStringReference = function (pkg) {
  pkg = pkg.toLowerCase();
  var result, match;
  if (PACKAGE.test(pkg)) {
    result = {
      type: 'tag',
      name: pkg,
      tag: 'latest'
    };
  } else if (PACKAGE_VERSION.test(pkg)) {
    match = PACKAGE_VERSION.exec(pkg);
    result = {
      name: match[1] + match[2]
    };
    _.extend(result, getValidVersion(match[3]))
  } else {
    throw new PackageDependencyError('Unknown package version definition format ' + pkg);
    // TODO: git dependency moved to 0.2.0
    //var gitUrl = gitUrlParse(pkg);
    //debug(gitUrl);
    //result = {
    //  type: 'git',
    //  url: gitUrl.toString('git'),
    //  gitUrl: gitUrl
    //};
  }
  return result;
};

/**
 *
 * @param name
 * @param version
 * @return {{}}
 */
var parseObjectReference = function (name, version) {
  var result = {};
  if (!name) {
    throw new PackageDependencyError('PackageDependency.name should be not empty!');
  }
  // TODO: why?
  // check reserved package names
  if (name === 'local' || name === 'version') {
    throw new PackageDependencyError('PackageDependency.name %s is reserved.', name);
  }
  result.name = name;
  if (typeof version === 'string') {
    // dependency in form name : version
    result.version = version;
    result.local = false;
  } else if (typeof version === 'object') {
    // dependency in form <name> : { version: <version>, local: <local> }
    result.version = version.version;
    result.local = version.local || false;
  }
  if (!result.version) {
    throw new PackageDependencyError('PackageDependency.version should be not empty!');
  }
  // TODO: cleanup HACK
  _.extend(result, getValidVersion(result.version));
  return result;
};

/**
 * PackageDependency
 * @param name
 *  reserved package names
 *    - local
 *    - version
 * @param versionOrLocal semver version | range | tag | { version: <version> | <range> | <tag>, local : true | false }
 * @returns {PackageDependency}
 * @constructor
 */
function PackageDependency(name, versionOrLocal) {
  var self = this;
  // 1. parse arguments
  if (!versionOrLocal || typeof versionOrLocal === 'boolean') {
    // 1.1. create from string reference
    self.literal = name + (versionOrLocal ? ' --local' : '');
    self.local = versionOrLocal || false;
    _.extend(self, parseStringReference(name));
  } else {
    // 1.2. create from object reference
    _.extend(self, parseObjectReference(name, versionOrLocal));
    self.literal = self.getDependencyLiteral();
  }
  return self;
}

/**
 *
 * @return {*} simplified PackageDependency object
 */
PackageDependency.prototype.getDependencyLiteral = function () {
  var self = this;
  if (self.literal) return self.literal;
  var result = null;
  switch (self.type) {
    case 'tag':
      result = self.name + (self.tag === 'latest' ? '' : '@' + self.tag);
      break;
    case 'version':
      result = self.name +  '@' + self.version;
      break;
    case 'versionRange':
      result = self.name +  '@' + self.versionRange;
      break;
  }
  return result + (self.local ? ' --local' : '');
};

/**
 * PackageDependency
 * @type {PackageDependency}
 */
module.exports = PackageDependency;
