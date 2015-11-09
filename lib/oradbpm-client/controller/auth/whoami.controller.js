'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var ErrorHandler = require('./../../common/error.js');
var debug = require('debug')('oradbpm:ctrl:whoami');

/**
 * Return to stdout currently logged-in username
 * @returns {*} Promise
 */
var logout = function () {
  var oraDBPMClient = this;
  return oraDBPMClient.localConfigFileService.read()
    .then(function (localConfig) {
      debug('localConfig %s', localConfig);
      if (!localConfig.username) {
        return Bluebird.reject(new ErrorHandler.OraDBPMClientError('Not logged in.'));
      } else {
        return Bluebird.resolve(localConfig.username);
      }
    })
    .catch(new ErrorHandler.errorHandler(debug));
};

module.exports = logout;
