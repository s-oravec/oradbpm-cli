'use strict';

var DatabaseSchema = require('./database-schema.model');
//var _ = require('lodash');

function DeploymentPlan () {
  var self = this;
  self.mainPackageSchema = new DatabaseSchema('<main>');
  self.schemas = {};
  return self;
}

DeploymentPlan.prototype.getSchema = function (schemaNameBase) {
  var self = this;
  if (!schemaNameBase || schemaNameBase === '<main>') {
    return self.mainPackageSchema;
  } else if (!self.schemas[schemaNameBase]) {
    self.schemas[schemaNameBase] = new  DatabaseSchema(schemaNameBase);
  }
  return self.schemas[schemaNameBase];
};

//DeploymentPlan.prototype.traverseDependencies = function (packageDependencyTreeRoot) {
//  var queue = new Queue();
//
//  queue.push(packageDependencyTreeRoot);
//
//  while (!queue.isEmpty()) {
//
//    var nodeToProcess = queue.dequeue();
//    planNode(nodeToProcess);
//
//    _.forEach(nodeToProcess.children, function (childNode) {
//      queue.enqueue(childNode);
//    });
//  }
//
//
//};

module.exports = DeploymentPlan;

