'use strict';

var oraDBPMClient = require('./../main');
var Bluebird = require('bluebird');
var CLIError = require('./error.cli');
var debug = require('debug')('oradbpm:cli:get');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  debug('parsedArgs %s', JSON.stringify(parsedArgs));
  var options = {};
  options.save = parsedArgs.save || parsedArgs.s || false;
  options.saveDev = parsedArgs['save-dev'] || false;
  options.local =  parsedArgs.l || parsedArgs.local || false;
  options.global = parsedArgs.g || parsedArgs.global || false;
  if (options.local && options.global) {
    throw new CLIError('Choose either local or global, not both');
  }
  return oraDBPMClient.get(parsedArgs._, options);
};
