'use strict';

var oraDBPMClient = require('./../main');
var Bluebird = require('bluebird');
var chalk = require('chalk');
var CLIError = require('./error.cli');
var Table = require('cli-table');
var debug = require('debug')('oradbpm:cli:search');

var addTableRow = function (table, oradbpmPackage) {
  table.push([
    oradbpmPackage.name, oradbpmPackage.version, oradbpmPackage.description, oradbpmPackage.author, oradbpmPackage.keywords
  ]);
};

/**
 * Search repository
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  debug('parsedArgs %s', JSON.stringify(parsedArgs));
  var query = parsedArgs._.shift();
  if (query === undefined) {
    throw new CLIError('Mandatory search query is empty.');
  }
  return oraDBPMClient.search(query)
    .then(function (packages) {
      if (packages.length > 0) {
        console.log('Search results:\n');

        var table = new Table({
          chars: {
            'top': '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            'bottom': '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            'left': '',
            'left-mid': '',
            'mid': '',
            'mid-mid': '',
            'right': '',
            'right-mid': '',
            'middle': ' '
          },
          style: {'padding-left': 0, 'padding-right': 0}
        });

        for (var i = 0; i < packages.length; i++) {
          addTableRow(table, packages[i]);
        }

        console.log(table.toString());

      } else {
        console.log(chalk.yellow('No matching packages have been found.\n'));
      }
      return Bluebird.resolve();
    });
};
