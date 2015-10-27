'use strict';

var packageRepo = require('./oradbpm.client/service/PackageRepositoryService');
var localConfig = require('./oradbpm.client/service/LocalConfigFileService');
var debug = require('debug')('oradbpm:raDBPMClient');

// TODO: refactor using some dependency injection "container"
function OraDBPMClient() {
  debug('OraDBPMClient constructor');

  // services
  this.packageRepositoryService = packageRepo.PackageRepositoryServiceFactory();
  this.localConfigFileService = localConfig.LocalConfigFileServiceFactory();

  // methods
  this.login = require('./oradbpm.client/controller/auth/login.controller').bind(this);

  return this;
}

module.exports = OraDBPMClient;
