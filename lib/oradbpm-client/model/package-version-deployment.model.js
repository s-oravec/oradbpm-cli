'use strict';

var util = require('util');
var _ = require('lodash');
var error = require('../common/error');
var PackageDependencyTreeNode = require('./package-dependency-tree.model').PackageDependencyTreeNode;

/**
 *
 * @constructor
 * @return {PackageVersionDeployment}
 * @param packageDependencyTreeNode
 */
function PackageVersionDeployment(packageDependencyTreeNode) {
  var self = this;
  if (!(packageDependencyTreeNode instanceof PackageDependencyTreeNode)) throw new error.OraDBPMClientError('PackageVersionDeployment.constructor: packageDependencyTreeNode is not instance of PackageDependencyTreeNode');
  _.extend(self, packageDependencyTreeNode);
  return self;
}

util.inherits(PackageVersionDeployment, PackageDependencyTreeNode);

/**
 *
 * @type {PackageVersionDeployment}
 */
module.exports = PackageVersionDeployment;
