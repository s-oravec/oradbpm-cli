'use strict';

var Bluebird = require('bluebird');
var oraDBPMClient = require('./../main');
var chalk = require('chalk');

/**
 * Logout from repository
 * @param parsedArgs - minimist-style parsed args
 * @return {*} promise
 */
module.exports = function (parsedArgs) {
  return oraDBPMClient.logout().then(function () {
    console.log(chalk.green('Successfully logged out.\n'));
    return Bluebird.resolve();
  });
};
