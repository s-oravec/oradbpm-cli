'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var ErrorHandler = require('./../../common/error.js');
var debug = require('debug')('oradbpm:ctrl:view');

/**
 * @returns {*}
 */
var view = function (name) {
  debug('name %s', name);
  var oraDBPMClient = this;
  if (!name) {
    throw new ErrorHandler.OraDBPMClientError('Package name is empty');
  } else {
    return oraDBPMClient.packageRepositoryService.get(name)
      .catch(new ErrorHandler.errorHandler(debug));
  }
};

module.exports = view;
