'use strict';

var PackageDependencyTreeNode = require('./package-dependency-tree-node.model');
var util = require('util');

function PackageDependencyTreeRoot(packageVersionDefinition) {
  var self = this;
  self.parentNode = null;
  self.path = '.';
  self.packageVersionDefinition = packageVersionDefinition;
  self.children = [];
  return self;
};

util.inherits(PackageDependencyTreeRoot, PackageDependencyTreeNode);

module.exports = PackageDependencyTreeRoot;
