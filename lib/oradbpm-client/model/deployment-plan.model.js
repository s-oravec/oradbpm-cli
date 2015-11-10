'use strict';

var DatabaseSchema = require('./database-schema.model');
var _ = require('lodash');
var Bluebird = require('bluebird');

/**
 *
 * @return {DeploymentPlan}
 * @constructor
 */
function DeploymentPlan () {
  var self = this;
  self.mainPackageSchema = new DatabaseSchema('<main>');
  self.schemas = {};
  return self;
}

/**
 *
 * @param schemaNameBase
 * @param version
 * @return {*}
 */
DeploymentPlan.prototype.getSchema = function (schemaNameBase, version) {
  var self = this;
  // schemaBaseName is empty or <main> -> mainPackageSchema
  if (!schemaNameBase || schemaNameBase === '<main>') {
    return self.mainPackageSchema;
  } else {
    // existing schema or create new
    var schema = self.schemas[schemaNameBase] || {};
    // add schema version if not exists
    if (!schema[version]) {
      schema[version] = new  DatabaseSchema(schemaNameBase, version);
    }
    // set schema
    self.schemas[schemaNameBase] = schema;
    return schema[version];
  }
};

/**
 * @return {string|*}
 */
DeploymentPlan.prototype.toString = function () {
  //var copyOfThis = _.cloneDeep(this);
  return JSON.stringify(this);
};

DeploymentPlan.prototype.resolveConflicts = function (options) {
  var self = this;
  var schemasConflictResolutions = _.reduce(self.schemas, function (acc, schema) {
    acc.push(schema.resolveConflicts(options));
    return acc;
  }, []);
  // resolve conflicts in main schema
  return self.mainPackageSchema.resolveConflicts(options)
    // TODO: resolve schema conflicts - some packages may hint only one deployment in DB
    // resolve conflict in each schema of schemas
    .then(function () {
      return Bluebird.all(schemasConflictResolutions);
    });
};

module.exports = DeploymentPlan;

