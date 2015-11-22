'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');
var debug = require('debug')('oradbpm:ctrl:get');

var Queue = require('queue-fifo');
var promiseWhile = require('promise-while')(Bluebird);

var error = require('./../../common/error.js');
var PackageDependencyTreeModel = require('./../../model/package-dependency-tree-node.model.js');
var PackageVersionDefinition = require('./../../model/package-version-definition.model');
var PackageDependency = require('./../../model/package-dependency.model');
var DeploymentPlan = require('./../../model/deployment-plan.model');
var PackageVersionDeployment = require('./../../model/package-version-deployment.model');
var PackageDependencyTreeRootFactory = require('./../../factory/package-dependency-tree-root.factory');
// TODO: Move to PackageDependencyTreeNode


/**
 *
 * @param deploymentPlan
 * @param queue
 * @param packageRepositoryService
 * @return Array of {Promise} which resolves with processDependencyTreeNode
 */
var processDependencyTreeNode = function (deploymentPlan, queue, packageRepositoryService) {

  // breadth first algorithm
  var nodeToProcess = queue.dequeue();

  // process packageDependencyTreeNode
  // 1. populate dependencies
  return Bluebird.all(nodeToProcess.createChildDependencyTreeNodes(packageRepositoryService))
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
        // run sql and plsql packages in nearest global package
        // add deployment to nearest global schema
          .getSchema(nearestGlobalNode.packageVersionDefinition.name, nearestGlobalNode.packageVersionDefinition.version)
          .addProposal(
            new PackageVersionDeployment(nodeToProcess)
          );
      }

      // breadth first algorithm
      // 3. enqueue all children
      _.forEach(nodeToProcess.children, function (childNode) {
        queue.enqueue(childNode);
      });
      return Bluebird.resolve();
    })
    .catch(function (err) {
      return Bluebird.reject(err);
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
      return new Bluebird(function (resolve, reject) {
        return processDependencyTreeNode(deploymentPlan, nodesToProcessQueue, packageRepositoryService)
          .then(resolve)
          .catch(function (err) {
            return reject(err);
          });
      });
    }
  )
    .catch(function (err) {
      return Bluebird.reject(err);
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
  var packageDependencyTreeRootFactory = new PackageDependencyTreeRootFactory(oraDBPMClient.packageFileServiceFactory);

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
  return packageDependencyTreeRootFactory.createPackageDependencyTreeRoot(options.packageFilePath)
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
