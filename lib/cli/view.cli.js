'use strict';

var Bluebird = require('bluebird');
var CLIError = require('./error.cli');
var prettyjson = require('prettyjson');
var debug = require('debug')('oradbpm:cli:view');

/**
 * Search repository
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  var self = this;
  debug('parsedArgs %s', JSON.stringify(parsedArgs));
  var name = parsedArgs._.shift();
  if (name === undefined) {
    return Bluebird.reject(new CLIError('Package name is empty.'));
  }
  return self.oraDBPMClient.view(name)
    .then(function (pkg) {
      console.log(prettyjson.render({
        name: pkg.name,
        version: pkg.version,
        language: pkg.language,
        description: pkg.description,
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
