'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');

var login = function (username, password) {
  var oraDBPMClient = this;

  // 1. call service
  return oraDBPMClient.packageRepositoryService.login(username, password)
    // 2. read config
    .then(oraDBPMClient.localConfigFileService.read)
    // 3. set username
    .then(function (localConfig) {
      localConfig.username = username;
      return localConfig;
    })
    // 4. write config
    .then(oraDBPMClient.localConfigFileService.write)
    .then(function () {
      console.log(chalk.green('Successfully logged in.\n'));
    });
};

module.exports = login;
