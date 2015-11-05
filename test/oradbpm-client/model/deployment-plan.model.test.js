'use strict';

var chai = require('chai');
chai.should();

var DatabaseSchema = require('../../../lib/oradbpm-client/model/database-schema.model');
var DeploymentPlan = require('../../../lib/oradbpm-client/model/deployment-plan.model');

describe('DeploymentPlan', function () {

  it('constructor should create instance', function () {
    var deploymentPlan = new DeploymentPlan();
    (deploymentPlan instanceof DeploymentPlan).should.be.equal(true);
  });

  it('getSchema should return <main> when schemaNameBase not specified', function () {
    var deploymentPlan = new DeploymentPlan();
    var dbSchema = deploymentPlan.getSchema();
    (dbSchema instanceof DatabaseSchema).should.be.equal(true);
    dbSchema.schemaNameBase.should.be.equal('<main>');
  });

  it('getSchema should create new schema if schema not exists', function () {
    var deploymentPlan = new DeploymentPlan();
    // jshint expr: true
    deploymentPlan.schemas.should.be.empty;
    var dbSchema = deploymentPlan.getSchema('newSchema');
    (dbSchema instanceof DatabaseSchema).should.be.equal(true);
    dbSchema.schemaNameBase.should.be.equal('newSchema');
  });

});

