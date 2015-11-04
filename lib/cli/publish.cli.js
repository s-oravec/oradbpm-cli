'use strict';

var Bluebird = require('bluebird');
var oraDBPMClient = require('./../main');
var path = require('path');
var chalk = require('chalk');
var debug = require('debug')('oradbpm:cli:publish');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  debug('parsedArgs %s', JSON.stringify(parsedArgs));
  var packageFilePath = path.join(process.cwd(), (parsedArgs['oradbpm-dir'] || ''), 'oradb_package.json');
  var tag = parsedArgs.tag;
  return oraDBPMClient.publish(packageFilePath, tag)
    .then(function () {
      console.log(chalk.green('Package successfully published.\n'));
      return Bluebird.resolve();
    });
};
