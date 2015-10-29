'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');

// dev
var debug = require('debug')('oradbpm:ctrl:view');

/**
 * @returns {*}
 */
var view = function (pkgs) {
  debug('pkgs', pkgs);
  var oraDBPMClient = this;
  return Bluebird.resolve()
    .catch(function (err) {
      // TODO: refactor as common error handler service
      debug('catch', err);
      console.log(chalk.red('Package view failed.'));
      console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
      throw err;
    });
};

module.exports = view;
