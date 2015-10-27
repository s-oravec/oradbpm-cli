'use strict';

var oraDBPMClient = require('./../main');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  // console.log(JSON.stringify(parsedArgs));
  return oraDBPMClient.logout();
};
