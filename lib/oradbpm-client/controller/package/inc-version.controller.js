'use strict';

var Bluebird = require('bluebird');
var ErrorHandler = require('./../common/error-handler.controller');
var chalk = require('chalk');
var semver = require('semver');
var shell = require('shelljs');
var debug = require('debug')('oradbpm:ctrl:inc-version');

//TODO: refactor exceptions
function ValidationError(message, exitCode) {
  this.name = 'ValidationError';
  this.message = message;
  this.exitCode = exitCode || 1;
}

//TODO: refactor move to model
var validatePackage = function (oraDBPacakgeJSON) {
  if (
    semver.valid(oraDBPacakgeJSON.version, true) === null ||
    semver.clean(oraDBPacakgeJSON.version) !== oraDBPacakgeJSON.version
  ) {
    throw new ValidationError('Package version is invalid.');
  } else {
    return Bluebird.resolve(oraDBPacakgeJSON);
  }
};

/**
 * @returns {*}
 */
var incVersion = function (packageFilePath, versionInc) {
  debug('packageFilePath', packageFilePath, 'versionInc', versionInc);
  var oraDBPMClient = this;

  var packageVersionDefinitionFile = oraDBPMClient.packageFileServiceFactory.create(packageFilePath);
  var newVersion;

  return Bluebird.resolve()
    .then(function () {
      var gitStatusPorcelain = shell.exec('git status --porcelain', {silent: true}).output;
      if (!!gitStatusPorcelain) {
        throw new ErrorHandler.OraDBPMClientError('Git working copy is not clean.' + gitStatusPorcelain);
      } else {
        debug('gitStatusPorcelain: %s', gitStatusPorcelain);
        return Bluebird.resolve();
      }
    })
    .then(packageVersionDefinitionFile.read)
    .then(validatePackage)
    // bump version
    .then(function (oraDBPacakgeJSON) {
      oraDBPacakgeJSON.version = semver.inc(oraDBPacakgeJSON.version, versionInc, true);
      newVersion = oraDBPacakgeJSON.version;
      return Bluebird.resolve(oraDBPacakgeJSON);
    })
    .then(packageVersionDefinitionFile.write)
    .then(function () {
      // TODO: should depend on verbose option
      shell.config.silent = true;
      shell.exec('git add -A');
      shell.exec('git commit -m "increment version using oradbpm inc-version ' + versionInc + '"');
      shell.exec('git tag -a ' + newVersion + ' -m "new version tag ' + newVersion + ' added by oradbpm"');
      shell.exec('git push');
      shell.exec('git push --tags');
      shell.config.silent = false;
      return Bluebird.resolve(newVersion);
    })
    .catch(new ErrorHandler.errorHandler(debug));
};

module.exports = incVersion;
