'use strict';

var Bluebird = require('bluebird');
var debug = require('debug')('oradbpm:model:package-dependency');
var PackageDependency = require('./package-dependency.model');

// TODO: refactor

/**
 *
 * @param packageRepositoryService
 * @returns {PackageDependencyTree}
 * @constructor
 */
function PackageDependencyTree(packageRepositoryService) {
  var self = this;
  self.packageRepositoryService = packageRepositoryService;
  self.resolvedDependencies = [];
  debug('new PackageDependencyTree');
  return self;
}

/**
 *
 * @param packageVersion
 * @returns promise which resolves with self
 */
PackageDependencyTree.prototype.initWithPackageVersion = function (packageVersion) {
  var self = this;
  debug('initWithPackageVersion: %s@%s', packageVersion.name, packageVersion.version);
  self.packageVersion = packageVersion;
  return self.init();
};

/**
 *
 * @param packageDependency
 * @returns promise which resolves with self
 */
PackageDependencyTree.prototype.initWithPackageDependency = function (packageDependency) {
  var self = this;
  // get latest version
  debug('initWithPackageDependency: %s@%s', packageDependency.name, packageDependency.version);
  return self.packageRepositoryService
    .get(packageDependency.name)
    // set package version
    .then(function (packageVersion) {
      self.packageVersion = packageVersion;
      return self.init();
    });
};

/**
 *
 * @returns promise which resolves with self
 */
PackageDependencyTree.prototype.init = function () {
  var self = this;
  return Bluebird.
    // get both dependencies
    all([
      self.getDependencies(self.packageVersion.dependencies, self.resolvedDependencies)
    ])
    .then(function () {
      debug('"%s" init done', self.packageVersion.name);
      return Bluebird.resolve(self);
    });
};

/**
 *
 * @param dependencyRequirements
 * @param resolvedDependencies
 * @returns {Bluebird.all}
 */
// reusable for both dependencies and dev dependencies
PackageDependencyTree.prototype.getDependencies = function (dependencyRequirements, resolvedDependencies) {
  var self = this;
  // array of promises for resolving dependencies
  var dependencies = [];
  for (var prop in dependencyRequirements) {
    if (dependencyRequirements.hasOwnProperty(prop)) {
      // create dependency from dependency requirement
      var dependency = new PackageDependency(prop, dependencyRequirements[prop]);
      // create new dependency tree
      var dependencyTree = new PackageDependencyTree(self.packageRepositoryService);
      // push it to resolvedDependencies
      resolvedDependencies.push(dependencyTree);
      // init dependency tree with dependency
      dependencies.push(dependencyTree.initWithPackageDependency(dependency));
    }
  }
  return Bluebird
    .all(dependencies);
};

module.exports = PackageDependencyTree;
