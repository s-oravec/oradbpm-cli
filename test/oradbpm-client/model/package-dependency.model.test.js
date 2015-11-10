'use strict';

var chai = require('chai'),
  PackageDependency = require('../../../lib/oradbpm-client/model/package-dependency.model');

chai.should();

describe('PackageDependency', function () {

  it('should throw without name passed', function () {
    (function () {
      var x = new PackageDependency();
    }).should.throw();
  });

  it('should throw with reserved package name', function () {
    (function () {
      var x = new PackageDependency('local', '1.0.0');
    }).should.throw();
    (function () {
      var x = new PackageDependency('version', '1.0.0');
    }).should.throw();
  });

  it('should throw without version passed', function () {
    (function () {
      var x = new PackageDependency('package-name', {});
    }).should.throw();
    (function () {
      var x = new PackageDependency('package-name', {version: undefined});
    }).should.throw();
    (function () {
      var x = new PackageDependency('package-name', {version: null});
    }).should.throw();
  });

  it('should work with string version', function () {
    var x = new PackageDependency('package-name', 'version');
    x.name.should.be.equal('package-name');
    x.version.should.be.equal('version');
    x.local.should.be.equal(false);
  });

  it('should work with object version - without local', function () {
    var x = new PackageDependency('package-name', {version: 'version'});
    x.name.should.be.equal('package-name');
    x.version.should.be.equal('version');
    x.local.should.be.equal(false);
  });

  it('should work with object version - with local', function () {
    var x;
    x = new PackageDependency('package-name', {version: 'version', local: false});
    x.name.should.be.equal('package-name');
    x.version.should.be.equal('version');
    x.local.should.be.equal(false);
    x = new PackageDependency('package-name', {version: 'version', local: true});
    x.name.should.be.equal('package-name');
    x.version.should.be.equal('version');
    x.local.should.be.equal(true);
  });

  it('should parse string reference - package name', function () {
    var x;
    x = new PackageDependency('package-name');
    x.name.should.be.equal('package-name');
    x.type.should.be.equal('tag');
    x.tag.should.be.equal('latest');
    x.local.should.be.equal(false);
  });

  it('should parse string reference - package name, local', function () {
    var x;
    x = new PackageDependency('package-name', true);
    x.name.should.be.equal('package-name');
    x.type.should.be.equal('tag');
    x.tag.should.be.equal('latest');
    x.local.should.be.equal(true);
  });

  it('should parse string reference - package name, global', function () {
    var x;
    x = new PackageDependency('package-name', false);
    x.name.should.be.equal('package-name');
    x.type.should.be.equal('tag');
    x.tag.should.be.equal('latest');
    x.local.should.be.equal(false);
  });

  it('should parse string reference - package name + tag', function () {
    var x;
    x = new PackageDependency('package-name@latest');
    x.name.should.be.equal('package-name');
    x.type.should.be.equal('tag');
    x.tag.should.be.equal('latest');
    x.local.should.be.equal(false);
  });

  it('should parse string reference - package name + exact version', function () {
    var x;
    x = new PackageDependency('package-name@1.0.0');
    x.name.should.be.equal('package-name');
    x.type.should.be.equal('version');
    x.version.should.be.equal('1.0.0');
    x.local.should.be.equal(false);
  });

  it('should parse string reference - package name + version range', function () {
    var x;
    x = new PackageDependency('package-name@^1.0.0');
    x.name.should.be.equal('package-name');
    x.type.should.be.equal('versionRange');
    x.versionRangeLiteral.should.be.equal('^1.0.0');
    x.versionRange.should.be.equal('>=1.0.0 <2.0.0');
    x.local.should.be.equal(false);
  });

});
