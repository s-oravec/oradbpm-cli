'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');
var debug = require('debug')('oradbpm:ctrl:get');

var Queue = require('queue-fifo');
var promiseWhile = require('promise-while')(Bluebird);

var error = require('./../../common/error.js');
var PackageDependencyTreeModel = require('./../../model/package-dependency-tree.model');
var PackageVersionDefinition = require('./../../model/package-version-definition.model');
var PackageDependency = require('./../../model/package-dependency.model');
var DeploymentPlan = require('./../../model/deployment-plan.model');
var PackageVersionDeployment = require('./../../model/package-version-deployment.model');

/**
 *
 * @param packageDependencyTreeNode
 * @param packageRepositoryService
 * @return Array of {Promise} which resolve with children of packageDependencyTreeNode
 */
var createChildDependencyTreeNodes = function (packageDependencyTreeNode, packageRepositoryService) {
  return _.reduce(packageDependencyTreeNode.packageVersionDefinition.parsedDependencies, function (acc, pkgDependency, pkgName) {
    acc.push(
      packageRepositoryService.get(pkgName)
        .then(function (packageDefinition) {
          var child = new PackageDependencyTreeModel.PackageDependencyTreeNode(packageDependencyTreeNode, pkgDependency, packageDefinition);
          packageDependencyTreeNode.children.push(child);
          return child;
        })
    );
    return acc;
  }, []);
};

/**
 *
 * @param deploymentPlan
 * @param queue
 * @param packageRepositoryService
 * @return Array of {Promise} which resolves with processDependencyTreeNode
 */
var processDependencyTreeNode = function (deploymentPlan, queue, packageRepositoryService) {
  var nodeToProcess = queue.dequeue();

  // process packageDependencyTreeNode
  // 1. populate dependencies
  return Bluebird.all(createChildDependencyTreeNodes(nodeToProcess, packageRepositoryService))
    .then(function (dependencyTreeNodes) {
      // add children to node
      nodeToProcess.children = dependencyTreeNodes;

      // 2. TODO: add packageVersionDeploymentProposal to DeploymentPlan.getSchema(packageName)
      //debug(nodeToProcess.packageVersionDefinition.name, nodeToProcess.packageVersionDefinition.language);
      //debug(nodeToProcess.packageVersionDefinition);

      if (nodeToProcess.packageVersionDefinition.language === 'sqlplus') {
        // do not add to deploymentPlan as it is used only on client side and stored within package, that required it as its dependency
        //deploymentPlan
        //  .getSchema(nodeToProcess.packageVersionDefinition.name, nodeToProcess.packageVersionDefinition.version)
        //  .addProposal(
        //    new PackageVersionDeployment(nodeToProcess.packageVersionDefinition, nodeToProcess.dependency)
        //  );
      } else {
        var nearestGlobalNode = nodeToProcess.getNearestGlobal();
        deploymentPlan
        // add to nearest global
          .getSchema(nearestGlobalNode.packageVersionDefinition.name, nearestGlobalNode.packageVersionDefinition.version)
          .addProposal(
            new PackageVersionDeployment(nodeToProcess)
          );
      }

      // 3. enqueue all children
      _.forEach(nodeToProcess.children, function (childNode) {
        queue.enqueue(childNode);
      });
      return Bluebird.resolve();
    });
};

/**
 *
 * @param packageFileServiceFactory
 * @param options
 * @return {Promise}
 */
var createPackageDependencyTreeRoot = function (packageFileServiceFactory, options) {
  return packageFileServiceFactory.create(options.packageFilePath).read()
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
        return Bluebird.reject(err);
      }
    });
};

/**
 *
 * @param deploymentPlan
 * @param packageDependencyTreeRoot
 * @param packageRepositoryService
 * @return {Promise}
 */
var populateDependencies = function (deploymentPlan, packageDependencyTreeRoot, packageRepositoryService) {
  var nodesToProcessQueue = new Queue();
  // breadth first resolve dependencies - start with root
  nodesToProcessQueue.enqueue(packageDependencyTreeRoot);
  return promiseWhile(
    function () {
      return !nodesToProcessQueue.isEmpty();
    }, function () {
      return processDependencyTreeNode(deploymentPlan, nodesToProcessQueue, packageRepositoryService);
    })
    .then(function () {
      return Bluebird.resolve();
    });
};

/**
 *
 * @return {DeploymentPlan}
 */
var createDeploymentPlan = function () {
  // TODO: populate DeploymentPlan from existing (stored as oradb_modules + oradb_package.json within each package folder)
  return new DeploymentPlan();
};

/**
 * @param pkgReferences
 * @param options
 * @returns {Promise}
 */
var get = function (pkgReferences, options) {
  debug('pkgReferences %s options %s', pkgReferences, JSON.stringify(options, null, 2));
  var oraDBPMClient = this;

  // populate stored DeploymentPlan or create new
  var deploymentPlan = createDeploymentPlan();
  var packageDependencyTreeRoot = null;

  // create PackageReferences array from required pkgReferences
  var newDependencies = _.reduce(pkgReferences, function (acc, pkgReference) {
    acc.push(new PackageDependency(pkgReference, options.local));
    return acc;
  }, []);

  // create PackageDependencyTreeRoot
  // - read mainPackageVersionDefinitionFile = oradb_package.json
  // - or create anonymous root
  return createPackageDependencyTreeRoot(oraDBPMClient.packageFileServiceFactory, options)
  // merge required dependencies (pkgReferences) with dependencies already defined on root (loaded from file)
    .then(function (treeRoot) {
      treeRoot.mergeDependencies(newDependencies, {});
      packageDependencyTreeRoot = treeRoot;
      return treeRoot;
    })
    // populate tree of PackageDependencyTreeNodes - start with root
    .then(function (treeRoot) {
      return populateDependencies(deploymentPlan, treeRoot, oraDBPMClient.packageRepositoryService);
    })
    .then(function () {
      //debug(JSON.stringify(packageDependencyTreeRoot.removeCycles()));
      return deploymentPlan.resolveConflicts();
    })
    .then(function () {
      // TODO: download to oradb_modules folder
      //console.log(JSON.stringify(deploymentPlan.logPlan()));
      deploymentPlan.logPlan();
      return Bluebird.resolve();
    })
    .then(function () {
      // TODO: write to file if --save/--save-dev
      return Bluebird.resolve();
    })
    .catch(new error.errorHandler(debug));
};

module.exports = get;
