'use strict';

var oraDBPMClient = require('./../main');
// dev
var debug = require('debug')('oradbpm:cli:publish');
var path = require('path');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  debug('parsedArgs', JSON.stringify(parsedArgs));

  var packageFilePath = path.join(process.cwd(), (parsedArgs._.shift() || ''), 'oradb_package.json');
  var tag = parsedArgs.tag;

  return oraDBPMClient.publish(packageFilePath, tag);
};
