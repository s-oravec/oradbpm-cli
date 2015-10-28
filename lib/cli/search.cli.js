'use strict';

var oraDBPMClient = require('./../main');
var Bluebird = require('bluebird');
// dev
var debug = require('debug')('oradbpm:cli:search');
var chalk = require('chalk');

//TODO: align name, description, author, date, version, keywords
var logResultItem = function (oradbpmPackage) {
  console.log('    ' + chalk.cyan(oradbpmPackage.name) + ' ' + oradbpmPackage.description);
};

/**
 * Search repository
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  debug('parsedArgs', JSON.stringify(parsedArgs));
  var query = parsedArgs._.shift();
  if (query === undefined) {
    console.log(chalk.red('Mandatory search query is empty.'));
    return Bluebird.reject({
      name: 'CLIError',
      message: 'Mandatory search query is empty.',
      exitCode: 1
    });
  }
  return oraDBPMClient.search(query)
    .then(function(packages) {
      if (packages.length > 0) {
        console.log('Search results:\n');
        for (var i = 0; i < packages.length; i++) {
          logResultItem(packages[i]);
        }
      } else {
        console.log(chalk.red('No matching packages have been found.\n'));
      }
    });
};
