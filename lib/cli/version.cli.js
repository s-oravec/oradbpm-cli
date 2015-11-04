'use strict';

var oraDBPMClient = require('./../main');
var Bluebird = require('bluebird');
var chalk = require('chalk');

/**
 * Prints OraDBPM version to stdout
 * @returns {*} promise
 */
module.exports = function () {
  return oraDBPMClient.version()
    .then(function (version) {
      console.log(chalk.green(version));
      return Bluebird.resolve();
    });
};
