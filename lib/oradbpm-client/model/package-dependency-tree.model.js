'use strict';
var util = require('util');
var Bluebird = require('bluebird');
var debug = require('debug')('oradbpm:model:package-dependency');
var semver = require('semver');
var _ = require('lodash');

function PackageDependencyTreeNode(parentNode, dependency, packageDefinition) {
  var self = this;

  self.parentNode = parentNode;
  self.dependency = dependency;
  self.packageDefinition = packageDefinition;
  self.packageVersionDefinition = packageDefinition.packageVersionDefinitions[packageDefinition.tags.latest];

  return self;
}

PackageDependencyTreeNode.prototype.mergeDependencies = function (packageDependencies, options) {
  var self = this;

  options = options || {};
  options.whenMatchedUpdate = options.whenMatchedUpdate || false;
  self.packageVersionDefinition.parsedDependencies = self.packageVersionDefinition.parsedDependencies || {};

  // TODO: implement merge
  _.forEach(packageDependencies, function (packageDependency) {
    self.packageVersionDefinition.parsedDependencies[packageDependency.name] = packageDependency;
  });

  return self;
};

PackageDependencyTreeNode.prototype.getNearestGlobal = function () {
  var self = this;
  if (self instanceof PackageDependencyTreeRoot) {
    return self;
  } else {
    if (self.dependency.local) {
      return self.parentNode.getNearestGlobal();
    } else {
      return self;
    }
  }
};

function PackageDependencyTreeRoot(packageVersionDefinition) {
  var self = this;
  self.packageVersionDefinition = packageVersionDefinition;
  return self;
}

util.inherits(PackageDependencyTreeRoot, PackageDependencyTreeNode);

exports.PackageDependencyTreeNode = PackageDependencyTreeNode;
exports.PackageDependencyTreeRoot = PackageDependencyTreeRoot;
