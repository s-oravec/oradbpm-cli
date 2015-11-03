'use strict';

var oraDBPMClient = require('./../main');
var _ = require('lodash');
var Bluebird = require('bluebird');
var semver = require('semver');
// dev
var debug = require('debug')('oradbpm:cli:get');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  debug('parsedArgs', JSON.stringify(parsedArgs));
  var options = {};
  options.save = parsedArgs.save || parsedArgs.s || false;
  options.saveDev = parsedArgs['save-dev'] || false;
  options.local =  parsedArgs.l || parsedArgs.local || false;
  options.global = parsedArgs.g || parsedArgs.global || false;
  if (options.local && options.global) {
    return Bluebird.reject({
      name: 'CLIError',
      message: 'Choose either local or global, not both',
      exitCode: 1
    })
  }
  return oraDBPMClient.get(parsedArgs._, options);
};
