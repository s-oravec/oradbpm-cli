'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var ErrorHandler = require('./../../common/error.js');
var debug = require('debug')('oradbpm:ctrl:logout');

/**
 * Logout from repository and deletes username from local config
 * @returns {*} Promise.resolve()
 */
var logout = function () {
  var oraDBPMClient = this;
  return oraDBPMClient.packageRepositoryService.logout()
    .then(oraDBPMClient.localConfigFileService.read)
    .then(function (localConfig) {
      debug('localConfig', localConfig);
      localConfig.username = undefined;
      return localConfig;
    })
    .then(oraDBPMClient.localConfigFileService.write)
    .then(function () {
      return Bluebird.resolve();
    })
    .catch(new ErrorHandler.errorHandler(debug));
};

module.exports = logout;
