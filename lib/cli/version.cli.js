'use strict';

var Bluebird = require('bluebird');
var pkg = require('./../../package.json');

/**
 * Prints OraDBPM version to stdout
 * @returns {*} promise
 */
module.exports = function () {
  var version = pkg.version;
  console.log(version);
  return Bluebird.resolve(version);
};
