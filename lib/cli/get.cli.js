'use strict';

var oraDBPMClient = require('./../main');
var _ = require('lodash');
var Bluebird = require('bluebird');
var semver = require('semver');
var GitUrlParse = require('git-url-parse');
// dev
var debug = require('debug')('oradbpm:cli:get');

var PACKAGE = /^[a-z]+(-[0-9a-z]+)*$/;
var PACKAGE_VERSION = /^([a-z]+)(-[0-9a-z]+)*@(.+)$/;
var GIT_USER_REPO = /([-\w]+)\/([-\w]+)/;

var parsePackageReference = function (pkg) {
  pkg = pkg.toLowerCase();
  var result, match;
  if (PACKAGE.test(pkg)) {
    debug('it\'s a package name without version');
    result = {
      type: 'package-tag',
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
      result.type = 'package-version';
      result.version = semver.valid(version, true);
    } else if (semver.validRange(version, true)) {
      result.type = 'package-versionRange';
      result.versionRange = semver.validRange(version, true);
    } else {
      result.type = 'package-tag';
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

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  debug('parsedArgs', JSON.stringify(parsedArgs));
  var save = parsedArgs.save || parsedArgs.s;
  var saveDev = parsedArgs['save-dev'];
  var pkgs = [];
  _.map(parsedArgs._, function (pkg) {
    pkgs.push(parsePackageReference(pkg));
  });
  debug('pkgs', pkgs);
  return oraDBPMClient.get(pkgs);
};
