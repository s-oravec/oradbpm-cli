'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var semver = require('semver');
var shell = require('shelljs');

// dev
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
  }
  return Bluebird.resolve(oraDBPacakgeJSON);
};

/**
 * @returns {*}
 */
var incVersion = function (packageFilePath, versionInc) {
  debug('packageFilePath', packageFilePath, 'versionInc', versionInc);
  var oraDBPMClient = this;

  var packageFileService = oraDBPMClient.packageFileServiceFactory.create(packageFilePath);
  var newVersion;

  Bluebird.resolve()
    .then(function () {
      //shell.config.silent = true;
      var gitStatusPorcelain = shell.exec('git status --porcelain', {silent: true}).output;
      //shell.config.silent = false;
      if (!!gitStatusPorcelain) {
        console.log(chalk.red(gitStatusPorcelain));
        return Bluebird.reject({
          name: 'GitSanityCheckError',
          message: 'Git working copy is not clean.',
          exitCode: 1
        });
      } else {
        return Bluebird.resolve();
      }
    })
    .then(packageFileService.read)
    .then(validatePackage)
    // bump version
    .then(function (oraDBPacakgeJSON) {
      oraDBPacakgeJSON.version = semver.inc(oraDBPacakgeJSON.version, versionInc, true);
      newVersion = oraDBPacakgeJSON.version;
      return Bluebird.resolve(oraDBPacakgeJSON);
    })
    .then(packageFileService.write)
    .then(function () {
      shell.config.silent = true;
      shell.exec('git add -A');
      shell.exec('git commit -m "increment version using oradbpm inc-version ' + versionInc + '"');
      shell.exec('git tag -a ' + newVersion + ' -m "new version tag ' + newVersion + ' added by oradbpm"');
      shell.exec('git push');
      shell.exec('git push --tags');
      shell.config.silent = false;
      console.log(chalk.green('New package version is ' + newVersion + '.'));
      return Bluebird.resolve(newVersion);
    })
    .catch(function (err) {
      // TODO: refactor as common error handler service
      debug('catch', err);
      console.log(chalk.red('Package inc-version failed.'));
      console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
      throw err;
    });
};

module.exports = incVersion;
