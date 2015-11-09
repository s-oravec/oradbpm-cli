'use strict';

var Bluebird = require('bluebird');
var ErrorHandler = require('./../../common/error.js');
var debug = require('debug')('oradbpm:ctrl:get');
var PackageDependencyTreeModel = require('./../../model/package-dependency-tree.model');
var PackageVersionDefinition = require('./../../model/package-version-definition.model');
var PackageDependency = require('./../../model/package-dependency.model');
var DeploymentPlan = require('./../../model/deployment-plan.model');
var PackageVersionDeployment = require('./../../model/package-version-deployment.model');
var _ = require('lodash');
var Queue = require('queue-fifo');
var promiseWhile = require('promise-while')(Bluebird);

var processDependencyTreeNode = function (oraDBPMClient, queue, deploymentPlan) {
  var nodeToProcess = queue.dequeue();
  //debug('processDependencyTreeNode', nodeToProcess);

  // TODO: refactor to method
  // process packageDependencyTreeNode

  // 1. TODO: populate dependencies
  var dependencyTreeNodes = _.reduce(nodeToProcess.packageVersionDefinition.parsedDependencies, function (acc, pkgDependency, pkgName) {
    acc.push(oraDBPMClient.packageRepositoryService.get(pkgName)
      .then(function (packageDefinition) {
        return new PackageDependencyTreeModel.PackageDependencyTreeNode(nodeToProcess, pkgDependency, packageDefinition);
      })
    );
    return acc;
  }, []);

  // after all promises resolve
  return Bluebird.all(dependencyTreeNodes)
    .then(function (dependencyTreeNodes) {
      // add children to root node
      nodeToProcess.children = dependencyTreeNodes;
      //debug(packageDependencyTreeRoot.children);
      return Bluebird.resolve();
    })
    .then(function () {
      // 2. TODO: add packageVersionDeploymentProposal to DeploymentPlan.getSchema(packageName)
      debug(nodeToProcess.packageVersionDefinition.name, nodeToProcess.packageVersionDefinition.language);
      debug(nodeToProcess.packageVersionDefinition);
      if (nodeToProcess.packageVersionDefinition.language === 'sqlplus') {
        // add to mainPackageSchema
        deploymentPlan.mainPackageSchema.addProposal(new PackageVersionDeployment(nodeToProcess.packageVersionDefinition, nodeToProcess.dependency));
      } else {
        deploymentPlan.getSchema(nodeToProcess.packageVersionDefinition.name).addProposal(new PackageVersionDeployment(nodeToProcess.packageVersionDefinition, nodeToProcess.dependency));
      }
      // 3. enqueue all children
      _.forEach(nodeToProcess.children, function (childNode) {
        queue.enqueue(childNode);
      });
      return Bluebird.resolve();
    });
};

/**
 * @param pkgReferences
 * @param options
 * @returns {*} Promise
 */
var view = function (pkgReferences, options) {
  debug('pkgReferences %s options %s', pkgReferences, JSON.stringify(options, null, 2));
  var oraDBPMClient = this;

  var deploymentPlan = new DeploymentPlan();
  // TODO: repopulate deployment plan from existing (stored as oradb_modules + oradb_package.json within each package folder)

  // create PackageReferences array from pkgReferences
  var newDependencies = _.reduce(pkgReferences, function (acc, pkgReference) {
    debug(pkgReference);
    acc.push(new PackageDependency(pkgReference, options.local));
    return acc;
  }, []);

  // read mainPackageVersionDefinitionFile = oradb_package.json
  return oraDBPMClient.packageFileServiceFactory.create(options.packageFilePath).read()
    .then(function (mainPackageVersionDefinition) {
      // main package file definition exists -> use it as root
      var packageDependencyTreeRoot = new PackageDependencyTreeModel.PackageDependencyTreeRoot(mainPackageVersionDefinition);
      // TODO: reconstruct DependencyTree and DeploymentPlan form mainPackageDefinition
      return Bluebird.resolve(packageDependencyTreeRoot);
    })
    .catch(function (err) {
      if (err.name === 'JSONFileError' && err.exitCode === 1) {
        // main package file definition doesn't exist -> create anonymous root
        var packageDependencyTreeRoot = new PackageDependencyTreeModel.PackageDependencyTreeRoot(new PackageVersionDefinition({
          name: '<main>',
          version: '0.0.1',
          language: "plsql"
        }));
        return Bluebird.resolve(packageDependencyTreeRoot);
      } else {
        throw err;
      }
    })
    // merge required dependencies (get <pkgs>) with dependencies already defined on root
    .then(function (packageDependencyTreeRoot) {
      packageDependencyTreeRoot.mergeDependencies(newDependencies, {});
      //debug(JSON.stringify(packageDependencyTreeRoot));
      return packageDependencyTreeRoot;
    })
    .then(function (packageDependencyTreeRoot) {
      // TODO: refactor to method
      // Queue
      var queue = new Queue();
      queue.enqueue(packageDependencyTreeRoot);
      return promiseWhile(
        function () {
          return !queue.isEmpty();
        }, function () {
          return processDependencyTreeNode(oraDBPMClient, queue, deploymentPlan);
        });
    })
    .then(function () {

      debug(deploymentPlan);

      // TODO: add dependencies
      // TODO: create DeploymentPlan for dependencies
      return Bluebird.resolve();
    })
    .then(function () {
      // TODO: download to oradb_modules folder
      return Bluebird.resolve();
    })
    .then(function () {
      // TODO: write to file if --save/--save-dev
      return Bluebird.resolve();
    })
    .catch(new ErrorHandler.errorHandler(debug));

  //var packageDependencyTreeRoot = new PackageDependencyTreeModel.PackageDependencyTreeRoot()
  //
  //
  //return Bluebird.resolve()
  //  .catch(new ErrorHandler.errorHandler(debug));
};

module.exports = view;
