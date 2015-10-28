'use strict';

var Bluebird = require('bluebird'),
  chalk = require('chalk'),
  debug = require('debug')('oradbpm:service:package-file'),
  fs = Bluebird.promisifyAll(require('fs'));

/**
 * PackageFileServiceError
 * @param message error message
 * @param exitCode
 * @constructor
 */
function PackageFileServiceError(message, exitCode) {
  this.name = 'PackageFileServiceError';
  this.message = message;
  this.exitCode = exitCode || 1;
}

function PackageFileServiceFactory(packageFilePath) {
  debug('PackageFileServiceFactory called with options', packageFilePath);

  var PackageFileService = function () {
  };

  PackageFileService.prototype.read = function () {
    return fs.statAsync(packageFilePath)
      .then(function () {
        return fs.readFileAsync(packageFilePath, 'utf8')
          .then(function (data) {
            return JSON.parse(data);
          });
      }, function (err) {
        if (err.code === 'ENOENT') {
          throw new PackageFileServiceError('OraDBPM package ' + packageFilePath + ' not found.');
        } else {
          throw err;
        }
      });
  };

  PackageFileService.prototype.write = function (data) {
    return fs.writeFileAsync(packageFilePath, JSON.stringify(data, null, 2));
  };

  return new PackageFileService();
}

exports.PackageFileServiceFactory = PackageFileServiceFactory;
