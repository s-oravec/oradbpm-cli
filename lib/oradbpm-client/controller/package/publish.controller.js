'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var ErrorHandler = require('./../common/error-handler.controller');
var debug = require('debug')('oradbpm:ctrl:publish');

/**
 * @returns {*}
 */
var publish = function (packageFilePath, tag) {
  debug('arguments', JSON.stringify(arguments));
  var oraDBPMClient = this;
  // create mainPackageFile and read it
  return oraDBPMClient.packageFileServiceFactory.create(packageFilePath).read()
    .then(function (packageVersionDefinition) {
      return oraDBPMClient.packageRepositoryService.publish(packageVersionDefinition, tag);
    })
    .catch(new ErrorHandler.errorHandler(debug));
};

module.exports = publish;
