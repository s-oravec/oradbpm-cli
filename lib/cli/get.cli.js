'use strict';

//var oraDBPMClient = require('./../main');
var Bluebird = require('bluebird');
var CLIError = require('./error.cli');
var debug = require('debug')('oradbpm:cli:get');
var path = require('path');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  var self = this;
  debug('parsedArgs %s', JSON.stringify(parsedArgs));
  var options = {};
  options.save = parsedArgs.save || parsedArgs.s || false;
  options.saveDev = parsedArgs['save-dev'] || false;
  options.local =  parsedArgs.l || parsedArgs.local || false ;
  options.global =  parsedArgs.g || parsedArgs.global || !options.local;
  options.packageFilePath = path.join(process.cwd(), (parsedArgs['oradbpm-dir'] || ''), 'oradb_package.json');
  if (options.local && options.global) {
    throw new CLIError('Choose either local or global, not both.');
  }
  if (parsedArgs._.length === 0) {
    throw new CLIError('No package specified.');
  }
  return self.oraDBPMClient.get(parsedArgs._, options);
};
