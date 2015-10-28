'use strict';

var oraDBPMClient = require('./../main');

/**
 * Logout from repository
 * @param parsedArgs - minimist-style parsed args
 * @return {*} promise
 */
module.exports = function (parsedArgs) {
  return oraDBPMClient.logout();
};
