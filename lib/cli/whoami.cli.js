'use strict';

var oraDBPMClient = require('./../main');

/**
 * Return to stdout currently logged-in username
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  return oraDBPMClient.whoami();
};
