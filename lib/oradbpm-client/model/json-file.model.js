'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var debug = require('debug')('oradbpm:model:json-file');
var fs = Bluebird.promisifyAll(require('fs'));
var util = require('util');
var OraDBPMClientError = require('../common/error').OraDBPMClientError;

/**
 * JSONFileError
 * @param message common message
 * @param exitCode
 * @constructor
 */
function JSONFileError(message, exitCode) {
  this.name = 'JSONFileError';
  this.message = message;
  this.exitCode = exitCode || 1;
}

util.inherits(JSONFileError, OraDBPMClientError);

function JSONFile(packageFilePath) {
  debug('JSONFile', packageFilePath, 'constructor');

  this.read = function () {
    return fs.statAsync(packageFilePath)
      .then(function () {
        return fs.readFileAsync(packageFilePath, 'utf8')
          .then(function (data) {
            return JSON.parse(data);
          });
      }, function (err) {
        if (err.code === 'ENOENT') {
          throw new JSONFileError('JSON file ' + packageFilePath + ' not found.');
        } else {
          throw err;
        }
      });
  };

  this.write = function (data) {
    return fs.writeFileAsync(packageFilePath, JSON.stringify(data, null, 2));
  };

  return this;
}

/**
 *
 * @type {JSONFile}
 */
module.exports = JSONFile;
