'use strict';

var chalk = require('chalk');
var Bluebird = require('bluebird');
var path = require('path');
var debug = require('debug')('oradbpm:cli:inc-version');

/**
 * Increments version in oradb_package.json, git tags and pushes to git repo
 * @param parsedArgs - minimist-style parsed args
 * @returns {*} promise
 */
module.exports = function (parsedArgs) {
  var self = this;
  debug('parsedArgs %s', JSON.stringify(parsedArgs));
  var packageFilePath = path.join(process.cwd(), (parsedArgs['oradbpm-dir'] || ''), 'oradb_package.json');
  var versionInc = parsedArgs._.shift();
  debug('packageFilePath %s', packageFilePath);
  debug('versionInc %s', versionInc);
  return self.oraDBPMClient['inc-version'](packageFilePath, versionInc)
    .then(function (newVersion) {
      console.log(chalk.green(versionInc + ' succesfully incremented.'));
      console.log(chalk.green('New package version is ' + newVersion + '.'));
      return Bluebird.resolve();
    });
};
