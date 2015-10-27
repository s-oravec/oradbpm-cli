'use strict';

var config = require('config'),
  Bluebird = require('bluebird'),
  fs = Bluebird.promisifyAll(require('fs')),
  chalk = require('chalk'),
  shell = require('shelljs'),
  semver = require('semver');

//TODO: refactor exceptions
var ValidationError = function (message) {
  this.exitCode = 1;
  this.error = {
    message: message
  };
  this.name = 'ValidationError';
};

//TODO: refactor to common package validation
var validatePackage = function (oraDBPacakgeJSON) {
  return new Bluebird(function (resolve, reject) {
    if (
      semver.valid(oraDBPacakgeJSON.version, true) === null ||
      semver.clean(oraDBPacakgeJSON.version) !== oraDBPacakgeJSON.version
    ) {
      throw new ValidationError('Package version is invalid.');
    }
    resolve(oraDBPacakgeJSON);
  });
};

//TODO: add git magic
var bumpVersion = function (newVersion) {
  console.log('Bumping package ' + newVersion + ' version.');
  // TODO: oradb_package.json to some util.constant
  fs.readFileAsync('oradb_package.json', 'utf8')
    .then(JSON.parse)
    .then(validatePackage)
    // bump version
    .then(function (oraDBPacakgeJSON) {
      oraDBPacakgeJSON.version = semver.inc(oraDBPacakgeJSON.version, newVersion, true);
      return new Bluebird.resolve(oraDBPacakgeJSON);
    })
    // write to file
    .then(function (oraDBPacakgeJSON) {
      return fs.writeFileAsync('oradb_package.json', JSON.stringify(oraDBPacakgeJSON, null, 2))
        .then(function () {
          return oraDBPacakgeJSON.version;
        });
    })
    .then(function (version) {
      shell.exec('git tag -a ' + version + ' -m "tagged by oradbpm"');
      shell.exec('git push');
      shell.exec('git push --tags');
      return version;
    })
    .then(function (version) {
      console.log(chalk.green('Version bumped to ' + version + '.\n'));
    })
    // catch rp error
    .catch(function (err) {
      if (!err.error) {
        console.error(chalk.red(err));
      } else {
        console.error(chalk.red(err.error.message));
      }
    });
};

exports.bumpVersion = bumpVersion;
