'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');

/**
 * Prints OraDBPM version to stdout
 * @returns {*} promise
 */
module.exports = function () {
  var self = this;
  return self.oraDBPMClient.version()
    .then(function (version) {
      console.log(chalk.green(version));
      return Bluebird.resolve();
    });
};
