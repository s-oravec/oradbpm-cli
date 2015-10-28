'use strict';

var oraDBPMClient = require('./../main');
// dev
var debug = require('debug')('oradbpm:cli:inc-version');
var Bluebird = require('bluebird');
var path = require('path');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  debug('parsedArgs', JSON.stringify(parsedArgs));
  var packageFilePath = './oradb_package.json';
  var versionInc = parsedArgs._.shift();
  debug('packageFilePath',packageFilePath);
  debug('versionInc',versionInc);

  return oraDBPMClient['inc-version'](packageFilePath, versionInc);
};
