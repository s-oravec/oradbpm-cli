'use strict';

var debug = require('debug')('oradbpm:service:package-version-definition-file');
var PackageVersionDefinitionFile = require('./../model/package-version-definition-file.model');

function PackageFileService(options) {
  debug('PackageFileService called with options', options);

  this.create = function (packageFilePath) {
    debug('PackageFileService.create called with packageFilePath', packageFilePath);
    return new PackageVersionDefinitionFile(packageFilePath);
  };

  return this;
}

module.exports = PackageFileService;
