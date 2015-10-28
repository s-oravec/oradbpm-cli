'use strict';

var debug = require('debug')('oradbpm:client');

// TODO: refactor using some dependency injection "container"
function OraDBPMClient() {
  debug('OraDBPMClient constructor');

  // services
  this.packageRepositoryService = require('./oradbpm.client/service/PackageRepositoryService').PackageRepositoryServiceFactory();
  this.localConfigFileService = require('./oradbpm.client/service/LocalConfigFileService').LocalConfigFileServiceFactory();
  this.packageFileServiceFactory = require('./oradbpm.client/service/package-file.service').PackageFileServiceFactory;
  
  // commands
  // authentication & authorization
  this.login = require('./oradbpm.client/controller/auth/login.controller').bind(this);
  this.logout = require('./oradbpm.client/controller/auth/logout.controller').bind(this);
  this.whoami = require('./oradbpm.client/controller/auth/whoami.controller').bind(this);
  // package
  this.publish = require('./oradbpm.client/controller/package/publish.controller').bind(this);
  this.search = require('./oradbpm.client/controller/package/search.controller').bind(this);
  this.view = require('./oradbpm.client/controller/package/view.controller').bind(this);
  this['inc-version'] = require('./oradbpm.client/controller/package/inc-version.controller').bind(this);

  return this;
}

module.exports = OraDBPMClient;
