'use strict';

var debug = require('debug')('oradbpm:raDBPMClient');

// TODO: refactor using some dependency injection "container"
function OraDBPMClient() {
  debug('OraDBPMClient constructor');

  // services
  this.packageRepositoryService = require('./oradbpm.client/service/PackageRepositoryService').PackageRepositoryServiceFactory();
  this.localConfigFileService = require('./oradbpm.client/service/LocalConfigFileService').LocalConfigFileServiceFactory();

  // methods
  this.login = require('./oradbpm.client/controller/auth/login.controller').bind(this);
  this.logout = require('./oradbpm.client/controller/auth/logout.controller').bind(this);

  return this;
}

module.exports = OraDBPMClient;
