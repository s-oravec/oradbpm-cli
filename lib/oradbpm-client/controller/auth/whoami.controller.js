'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
//dev
var debug = require('debug')('oradbpm:ctrl:whoami');

// TODO: move all console.log to cli

/**
 * Return to stdout currently logged-in username
 * @returns {*} Promise
 */
var logout = function () {
  var oraDBPMClient = this;
  return oraDBPMClient.localConfigFileService.read()
    .then(function (localConfig) {
      debug('localConfig', localConfig);
      if (!localConfig.username) {
        console.log(chalk.red('Whoooo are you?, who? who?, who? who?'));
        console.log(chalk.red('Use oradbpm login to login.'));
      } else {
        console.log(chalk.green(localConfig.username));
      }
    })
    .catch(function (err) {
      debug('catch', err);
      console.log(chalk.red('Whoami failed.'));
      console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
      throw err;
    });
};

module.exports = logout;
