'use strict';

var DatabaseSchema = require('./database-schema.model');

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

DeploymentPlan.prototype.toString = function () {
  //var copyOfThis = _.cloneDeep(this);
  return JSON.stringify(this);
};

module.exports = DeploymentPlan;

