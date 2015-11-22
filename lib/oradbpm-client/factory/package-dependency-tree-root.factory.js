'use strict';

var PackageDependencyTreeRoot = require('./../model/package-dependency-tree-root.model');
var Bluebird = require('bluebird');

var PackageDependencyTreeRootFactory = function (packageFileServiceFactory) {
  var self = this;

  self.createPackageDependencyTreeRoot = function (mainPackageFilePath) {
    // create PackageFileService for mainPackageFile at mainPackageFilePath
    return packageFileServiceFactory.create(mainPackageFilePath)
      // read the file
      .read()
      .then(function (mainPackageVersionDefinition) {
        // TODO: reconstruct DependencyTree and DeploymentPlan form mainPackageDefinition - in get
        // main package file definition exists -> use it as root
        // create root from packageFile
        return Bluebird.resolve(new PackageDependencyTreeRoot(mainPackageVersionDefinition));
      })
      .catch(function (err) {
        if (err.name === 'JSONFileError' && err.exitCode === 1) {
          // main package file definition doesn't exist -> create anonymous root
          return Bluebird.resolve(new PackageDependencyTreeRoot(new PackageVersionDefinition({
            name: '<main>',
            version: '0.0.1',
            language: 'plsql'
          })));
        } else {
          return Bluebird.reject(err);
        }
      });
  };

  return self;
};

module.exports = PackageDependencyTreeRootFactory;
