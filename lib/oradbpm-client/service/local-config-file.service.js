'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var debug = require('debug')('oradbpm:service:local-config');
var fs = Bluebird.promisifyAll(require('fs'));
var path = require('path');
var OraDBPMClientError = require('../common/error').OraDBPMClientError;
var util = require('util');

function ErrorKeyNotFound(key, message) {
  this.name = 'ErrorKeyNotFound';
  this.message = message || 'Key not found' + key;
}

util.inherits(ErrorKeyNotFound, OraDBPMClientError);

function LocalConfigFileServiceFactory(options) {
  debug('LocalConfigFileServiceFactory called with options', options);

  var localConfigFileName = __dirname + '/../../../config/local.json';
  debug('localConfigFileName', localConfigFileName);

  var LocalConfigFileService = function () {
  };

  LocalConfigFileService.prototype.read = function () {
    return fs.statAsync(localConfigFileName)
      .then(function () {
        return fs.readFileAsync(localConfigFileName, 'utf8')
          .then(function (data) {
            return JSON.parse(data);
          });
      }, function (err) {
        if (err.code === 'ENOENT') {
          return Bluebird.resolve({});
        } else {
          throw err;
        }
      });
  };

  LocalConfigFileService.prototype.write = function (data) {
    return fs.writeFileAsync(localConfigFileName, JSON.stringify(data, null, 2));
  };

  return new LocalConfigFileService();
}

exports.LocalConfigFileServiceFactory = LocalConfigFileServiceFactory;
