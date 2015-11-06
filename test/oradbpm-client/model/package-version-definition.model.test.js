'use strict';

var chai = require('chai');
chai.should();

var PackageVersionDefinition = require('../../../lib/oradbpm-client/model/package-version-definition.model');

describe('PackageVersionDefinition', function () {

  it('constructor should create instance', function () {
    var packageVersionDefinition = new PackageVersionDefinition({
      name: 'package-name',
      version: '1.0.0',
      language: 'plsql'
    });
    packageVersionDefinition.should.be.instanceOf(PackageVersionDefinition);
  });
  
  it('constructor should throw if language is not defined', function () {
    (function () {
      new PackageVersionDefinition({
        name: 'package',
        version: '1.0.0'
      });
    }).should.throw();
  });

  it('constructor should throw if version is not defined', function () {
    (function () {
      new PackageVersionDefinition({
        name: 'package',
        language: 'sqlplus'
      });
    }).should.throw();
  });

  it('constructor should throw if version is invalid', function () {
    (function () {
      new PackageVersionDefinition({
        name: 'package',
        language: 'sqlplus',
        version: '1.0.0.0'
      });
    }).should.throw();
  });

});
