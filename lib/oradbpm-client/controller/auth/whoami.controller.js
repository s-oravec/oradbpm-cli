'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var ErrorHandler = require('./../common/error-handler.controller');
var debug = require('debug')('oradbpm:ctrl:whoami');

/**
 * Return to stdout currently logged-in username
 * @returns {*} Promise
 */
var logout = function () {
  var oraDBPMClient = this;
  return oraDBPMClient.localConfigFileService.read()
    .then(function (localConfig) {
      debug('localConfig %s', localConfig);
      return Bluebird.resolve(localConfig.username);
    })
    .catch(new ErrorHandler.errorHandler(debug));
};

module.exports = logout;
