'use strict';

var _ = require('lodash');
var debug = require('debug')('oradbpm:model:package-dependency');
var semver = require('semver');

var PACKAGE = /^[a-z]+(-[0-9a-z]+)*$/;
var PACKAGE_VERSION = /^([a-z]+)(-[0-9a-z]+)*@(.+)$/;
//var GIT_USER_REPO = /([-\w]+)\/([-\w]+)/; - not implemented yet

var parseStringReference = function (pkg) {

  //console.log(pkg);

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
    var name = match[1] + match[2];
    var version = match[3];
    result = {
      name: match[1] + match[2]
    };
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
      result.tag = match[3].trim();
    }
  } else {
    var gitUrl = GitUrlParse(pkg);
    debug(gitUrl);
    result = {
      type: 'git',
      url: gitUrl.toString('git'),
      gitUrl: gitUrl
    };
  }
  return result;
};

var parseOradbPackageReference = function (name, version) {

  //console.log('name', name, 'version', version);

  var result = {};
  if (!name) {
    // TODO: PackageDependencyError
    throw new Error('PackageDependency.name should be not empty!');
  }
  // check reserved package names
  if (name === 'local' || name === 'version') {
    throw new Error('PackageDependency.name %s is reserved.', name);
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
    throw new Error('PackageDependency.version should be not empty!');
  }
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

  //console.log(arguments);

  // 1. parse arguments
  if (!versionOrLocal || typeof versionOrLocal === 'boolean') {
    // 1.1. create from string reference
    self.local = versionOrLocal || false;
    _.extend(self, parseStringReference(name));
  } else {
    // 1.2. create from object reference
    _.extend(self, parseOradbPackageReference(name, versionOrLocal));
  }

  //console.log(arguments, self);
  return self;
}

PackageDependency.prototype.getSimpleNotation = function () {
  var result = {
    local : this.local
  };
  switch (this.type) {
    case 'tag':
      result[this.name] = {tag: this.tag};
      break;
    case 'version':
      result[this.name] = {version: this.version};
      break;
    case 'versionRange':
      result[this.name] = {version: this.versionRange};
      break;
    case 'git':
      result[this.name] = {version: this.url};
      break;
  }
  return result;
};

/**
 * PackageDependency
 * @type {PackageDependency}
 */
module.exports = PackageDependency;
