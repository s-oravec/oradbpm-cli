'use strict';
var util = require('util');
var Bluebird = require('bluebird');
var debug = require('debug')('oradbpm:model:package-dependency');
var semver = require('semver');
var path = require('path');
var _ = require('lodash');

function PackageDependencyTreeNode(parentNode, dependency, packageDefinition) {
  var self = this;

  self.parentNode = parentNode;
  self.dependency = dependency;
  self.packageDefinition = packageDefinition;
  self.children = [];

  if (dependency.type === 'tag') {
    self.packageVersionDefinition = packageDefinition.packageVersionDefinitions[packageDefinition.tags[dependency.tag]];
  } else {
    self.packageVersionDefinition = packageDefinition.packageVersionDefinitions[semver.maxSatisfying(packageDefinition.versions, dependency.version, true)];
  }

  self.path = path.join(self.parentNode.path, 'oradb_modules', self.packageVersionDefinition.name || '@' || self.packageVersionDefinition.version);

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

PackageDependencyTreeNode.prototype.removeCycles = function () {
  var self = this;
  var result = _.extend({}, self);
  delete result.parentNode;
  delete result.children;
  result.children = _.reduce(self.children, function (acc, child) {
    acc.push(child.removeCycles());
    return acc;
  }, []);
  return result;
};

function PackageDependencyTreeRoot(packageVersionDefinition) {
  var self = this;
  self.parentNode = null;
  self.path = '.';
  self.packageVersionDefinition = packageVersionDefinition;
  self.children = [];
  return self;
}

util.inherits(PackageDependencyTreeRoot, PackageDependencyTreeNode);

exports.PackageDependencyTreeNode = PackageDependencyTreeNode;
exports.PackageDependencyTreeRoot = PackageDependencyTreeRoot;
