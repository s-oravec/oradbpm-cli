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
  // create mainPackageFile and read it
  oraDBPMClient.packageFileServiceFactory.create(packageFilePath).read()
    .then(function (packageVersionDefinition) {
      return oraDBPMClient.packageRepositoryService.publish(packageVersionDefinition, tag);
    })
    .then(function () {
      console.log(chalk.green('Package successfully published.\n'));
    })
    .catch(function (err) {
      // TODO: refactor as common error handler service
      debug('catch', err);
      console.log(chalk.red('Publish failed.'));
      console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
      throw err;
    });
};

module.exports = publish;
