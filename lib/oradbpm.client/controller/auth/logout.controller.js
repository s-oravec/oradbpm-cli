'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');

/**
 * Logout from repository and deletes username from local config
 * @param username
 * @param password
 * @returns {*}
 */
var logout = function () {
  var oraDBPMClient = this;
  return oraDBPMClient.packageRepositoryService.logout()
    .then(oraDBPMClient.localConfigFileService.read)
    .then(function (localConfig) {
      delete localConfig.username;
      return localConfig;
    })
    .then(oraDBPMClient.localConfigFileService.write)
    .then(function () {
      console.log(chalk.green('Successfully logged out.\n'));
    })
    .catch(function (err) {
      console.log(chalk.red('Logout failed.\n'));
      throw err;
    });
};

module.exports = logout;
