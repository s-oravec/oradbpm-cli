'use strict';

var Bluebird = require('bluebird');
var ErrorHandler = require('./../common/error-handler.controller');
// dev
var debug = require('debug')('oradbpm:ctrl:view');

/**
 * @returns {*}
 */
var view = function (pkgReferences, options) {
  debug('pkgReferences %s options %s', pkgReferences, options);
  var oraDBPMClient = this;
  return Bluebird.resolve()
    .catch(new ErrorHandler.errorHandler(debug));
};

module.exports = view;
