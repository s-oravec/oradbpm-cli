'use strict';

var Bluebird = require('bluebird');
var ErrorHandler = require('./../../common/error.js');
var debug = require('debug')('oradbpm:ctrl:login');

/**
 * Login into repository and store username in local config if successful,
 * so it can be used as default next time
 * also stores auth cookie in cookie jar file
 * @param username
 * @param password
 * @returns {*}
 */
var login = function (username, password) {
  var oraDBPMClient = this;
  return oraDBPMClient.packageRepositoryService.login(username, password)
    .then(oraDBPMClient.localConfigFileService.read)
    .then(function (localConfig) {
      localConfig.username = username;
      return localConfig;
    })
    .then(oraDBPMClient.localConfigFileService.write)
    .then(function () {
      return Bluebird.resolve();
    })
    .catch(new ErrorHandler.errorHandler(debug));
};

module.exports = login;
