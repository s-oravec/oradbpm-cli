'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');

/**
 * Writes currently logged-in username to stdout
 * @returns {*} promise
 */
module.exports = function () {
  var self = this;
  return self.oraDBPMClient.whoami()
    .then(function (username) {
        console.log(chalk.green(username));
        return Bluebird.resolve();
    });
};
