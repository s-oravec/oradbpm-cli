'use strict';

var debug = require('debug')('oradbpm:client');
var defaultPackageRepositoryServiceFactory = require('./oradbpm-client/service/package-repository.service');
var defaultLocalConfigFileServiceFactory = require('./oradbpm-client/service/local-config-file.service');
var DefaultPackageVersionDefinitionFileService = require('./oradbpm-client/service/package-version-definition-file.service.js');

// dependencies injected through options object
function OraDBPMClient(options) {

  debug('OraDBPMClient constructor');

  // default options
  options = options || {};
  options.packageRepositoryService = options.packageRepositoryService || defaultPackageRepositoryServiceFactory.PackageRepositoryServiceFactory();
  options.localConfigFileService = options.localConfigFileService || defaultLocalConfigFileServiceFactory.LocalConfigFileServiceFactory();
  options.packageFileServiceFactory = options.packageFileServiceFactory ||new DefaultPackageVersionDefinitionFileService();

  // services
  this.packageRepositoryService = options.packageRepositoryService;
  this.localConfigFileService = options.localConfigFileService;
  this.packageFileServiceFactory = options.packageFileServiceFactory;

  // commands
  // authentication & authorization
  this.login = require('./oradbpm-client/controller/auth/login.controller').bind(this);
  this.logout = require('./oradbpm-client/controller/auth/logout.controller').bind(this);
  this.whoami = require('./oradbpm-client/controller/auth/whoami.controller').bind(this);
  // package
  this.publish = require('./oradbpm-client/controller/package/publish.controller').bind(this);
  this.search = require('./oradbpm-client/controller/package/search.controller').bind(this);
  this.view = require('./oradbpm-client/controller/package/view.controller').bind(this);
  this['inc-version'] = require('./oradbpm-client/controller/package/inc-version.controller').bind(this);
  //this.get = require('./oradbpm-client/controller/package/get.controller').bind(this);

  return this;
}

module.exports = OraDBPMClient;
