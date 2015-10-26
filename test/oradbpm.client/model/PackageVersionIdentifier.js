'use strict';

var chai = require('chai'),
  PackageVersionIdentifier = require('../../../lib/oradbpm.client/model/PackageVersionIdentifier');

chai.should();

describe('PackageVersionIdentifier', function () {

  it('should throw without name passed', function () {
    (function () {
      var x = new PackageVersionIdentifier();
    }).should.throw();
  });

  it('should throw without name passed', function () {
    (function () {
      var x = new PackageVersionIdentifier(undefined, '1.0.0');
    }).should.throw();
  });

  it('should throw without name passed', function () {
    (function () {
      var x = new PackageVersionIdentifier(null, '1.0.0');
    }).should.throw();
  });

  it('should throw if version number is invalid (validate using semver)', function () {
    (function () {
      var x = new PackageVersionIdentifier('package-name', '1.0.0.0.0');
    }).should.throw();
  });

});
