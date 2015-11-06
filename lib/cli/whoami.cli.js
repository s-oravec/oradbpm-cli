'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var CLIError = require('./error.cli');

/**
 * Writes currently logged-in username to stdout
 * @returns {*} promise
 */
module.exports = function () {
  var self = this;
  return self.oraDBPMClient.whoami()
    .then(function (username) {
      if (!username) {
        throw new CLIError('Not logged in');
      } else {
        console.log(chalk.green(username));
        return Bluebird.resolve();
      }
    });
};
