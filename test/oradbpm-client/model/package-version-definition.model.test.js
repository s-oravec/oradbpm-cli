'use strict';

var chai = require('chai');
chai.should();

var PackageVersionDefinition = require('../../../lib/oradbpm-client/model/package-version-definition.model');

describe('PackageVersionDefinition', function () {

  it('constructor should create instance', function () {
    var packageVersionDefinition = new PackageVersionDefinition({
      name: 'package_name',
      version: '1.0.0',
      description: "some package",
      license: "MIT",
      language: 'plsql'
    });
    packageVersionDefinition.should.be.instanceOf(PackageVersionDefinition);
  });
  
  it('constructor should throw if language is not defined', function () {
    (function () {
      new PackageVersionDefinition({
        name: 'package',
        version: '1.0.0',
        description: "some package",
        license: "MIT"
      });
    }).should.throw();
  });

  it('constructor should throw if version is not defined', function () {
    (function () {
      new PackageVersionDefinition({
        name: 'package',
        description: "some package",
        license: "MIT",
        language: 'sqlplus'
      });
    }).should.throw();
  });

  it('constructor should throw if version is invalid', function () {
    (function () {
      new PackageVersionDefinition({
        name: 'package',
        language: 'sqlplus',
        description: "some package",
        license: "MIT",
        version: '1.0.0.0'
      });
    }).should.throw();
  });

});
