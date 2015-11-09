'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var ErrorHandler = require('./../../common/error.js');
var debug = require('debug')('oradbpm:ctrl:search');

/**
 * @returns {*}
 */
var search = function (query) {
  debug('arguments', JSON.stringify(arguments));
  var oraDBPMClient = this;
  if (!query) {
    throw new ErrorHandler.OraDBPMClientError('Query is empty');
  } else {
    return oraDBPMClient.packageRepositoryService.search(query)
      .catch(new ErrorHandler.errorHandler(debug));
  }
};

module.exports = search;
