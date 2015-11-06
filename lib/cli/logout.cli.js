'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');

/**
 * Logout from repository
 * @param parsedArgs - minimist-style parsed args
 * @return {*} promise
 */
module.exports = function (parsedArgs) {
  var self = this;
  return self.oraDBPMClient.logout().then(function () {
    console.log(chalk.green('Successfully logged out.\n'));
    return Bluebird.resolve();
  });
};
