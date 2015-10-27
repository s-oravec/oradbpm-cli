'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
// dev
var debug = require('debug')('oradbpm:ctrl:publish');

/**
 * @returns {*}
 */
var publish = function (packageFilePath, tag) {
  debug('arguments', JSON.stringify(arguments));
  var oraDBPMClient = this;
  return oraDBPMClient.packageRepositoryService.publish(packageFilePath, tag)
    .then(function () {
      console.log(chalk.green('Package successfully published.\n'));
    })
    .catch(function (err) {
      // TODO: refactor as common error handler service
      debug('catch', err);
      console.log(chalk.red('Publish failed.'));
      console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
    });
};

module.exports = publish;
