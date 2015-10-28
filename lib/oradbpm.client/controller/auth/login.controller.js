'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
// dev
var debug = require('debug')('oradbpm:ctrl:login');

// TODO: refactor as common error handler service
var handleError = function (err) {
  debug('catch', err);
  console.log(chalk.red('Login failed.'));
  console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
  throw err;
};

/**
 * Login into repository and store username in local config if successful,
 * so it can be used as default next time
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
      console.log(chalk.green('Successfully logged in.\n'));
    })
    .catch(handleError);
};

module.exports = login;
