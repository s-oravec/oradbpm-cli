'use strict';

var Bluebird = require('bluebird');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  //TODO: read from package.json file
  var version = '0.0.1';
  console.log(version);
  return Bluebird.resolve(version);
};
