'use strict';

var pkg = require('./../../../../package.json');
var Bluebird = require('bluebird');

var version = function() {
  return Bluebird.resolve(pkg.version);
};

module.exports = version;
