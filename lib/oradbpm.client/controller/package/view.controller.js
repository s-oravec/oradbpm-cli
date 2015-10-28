'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');

// dev
var debug = require('debug')('oradbpm:ctrl:view');

/**
 * @returns {*}
 */
var view = function (name) {
  debug('name', name);
  var oraDBPMClient = this;
  if (!name) return Bluebird.reject('Package name is empty');
  return oraDBPMClient.packageRepositoryService.get(name)
    .catch(function (err) {
      // TODO: refactor as common error handler service
      debug('catch', err);
      console.log(chalk.red('Package view failed.'));
      console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
      throw err;
    });
};

module.exports = view;
