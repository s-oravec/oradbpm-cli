'use strict';

var read = require('read');
var oraDBPMClient = require('./../main');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  return oraDBPMClient.localConfigFileService.logout();
};
