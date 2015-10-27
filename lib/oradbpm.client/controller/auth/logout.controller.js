'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
//dev
var debug = require('debug')('oradbpm:ctrl:logout');

/**
 * Logout from repository and deletes username from local config
 * @returns {*}
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
      console.log(chalk.green('Successfully logged out.\n'));
    })
    .catch(function (err) {
      debug('catch', err);
      console.log(chalk.red('Logout failed.'));
      console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
    });
};

module.exports = logout;
