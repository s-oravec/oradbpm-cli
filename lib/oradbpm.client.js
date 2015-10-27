var PackageRepositoryServiceFactory = require('./oradbpm.client/service/PackageRepositoryService');

// TODO: refactor using some dependency injection "container"
function OraDBPMClient() {
  var self = this;
  // TODO: wire-up client
  self.repositoryService = PackageRepositoryServiceFactory();

  return self;
}

OraDBPMClient.prototype.login = require('./oradbpm.client/controller/auth/login.controller');
//OraDBPMClient.prototype.logout = require('./oradbpm.client/controller/auth/logout.controller');

module.exports = OraDBPMClient;
