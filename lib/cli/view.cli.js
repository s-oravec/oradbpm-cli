'use strict';

var oraDBPMClient = require('./../main');
var Bluebird = require('bluebird');
// dev
var debug = require('debug')('oradbpm:cli:view');
var chalk = require('chalk');
var prettyjson = require('prettyjson');
var _ = require('lodash');
var semver = require('semver');

/**
 * Search repository
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  debug('parsedArgs', JSON.stringify(parsedArgs));
  var name = parsedArgs._.shift();
  if (name === undefined) {
    console.log(chalk.red('Package name is empty.'));
    return Bluebird.reject({
      name: 'CLIError',
      message: 'Package name is empty.',
      exitCode: 1
    });
  }
  return oraDBPMClient.view(name)
    .then(function (pkg) {

      console.log(prettyjson.render({
        name: pkg.name,
        version: pkg.version,
        descriptoin: pkg.description,
        author: pkg.author,
        license: pkg.license,
        keywords: pkg.keywords,
        maintainers: pkg.maintainers,
        tags: pkg.tags,
        versions: pkg.versions,
        time: pkg.time
      }));

      return Bluebird.resolve();
    });
};
