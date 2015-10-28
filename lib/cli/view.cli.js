'use strict';

var oraDBPMClient = require('./../main');
var Bluebird = require('bluebird');
// dev
var debug = require('debug')('oradbpm:cli:view');
var chalk = require('chalk');
var prettyjson = require('prettyjson');
var _ = require('lodash');
var semver = require('semver');

// TODO: move this to server?
var decodeKey = function (key) {
  return key.replace(/\uff0e/g, '.').replace(/\uff04/g, '$').replace(/\\\\/g, '\\');
};

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

      // TODO: fix time keys - move to server?
      _.map(pkg.time, function (value, key) {
        if (decodeKey(key) !== key) {
          pkg.time[decodeKey(key)] = value;
          delete pkg.time[key];
        }
      });

      console.log(prettyjson.render({
        name: pkg.name,
        version: pkg.version,
        descriptoin: pkg.description,
        author: pkg.author,
        license: pkg.license,
        keywords: pkg.keywords,
        maintainers: pkg.maintainers,
        tags: pkg.tags,
        versions: pkg.versions, // TODO: sort using lodash + semver
        time: pkg.time // TODO: sort using lodash lodash + semver
      }));

      return Bluebird.resolve();
    });
};
