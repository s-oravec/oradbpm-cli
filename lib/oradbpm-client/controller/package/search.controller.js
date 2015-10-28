'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');

// dev
var debug = require('debug')('oradbpm:ctrl:search');

/**
 * @returns {*}
 */
var search = function (query) {
  debug('arguments', JSON.stringify(arguments));
  var oraDBPMClient = this;
  if (!query) return Bluebird.reject('Query is empty');
  return oraDBPMClient.packageRepositoryService.search(query)
    .catch(function (err) {
      // TODO: refactor as common error handler service
      debug('catch', err);
      console.log(chalk.red('Search failed.'));
      console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
      throw err;
    });
};

module.exports = search;
