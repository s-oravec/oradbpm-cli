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
      var x = new PackageDependency('local','1.0.0');
    }).should.throw();
    (function () {
      var x = new PackageDependency('version','1.0.0');
    }).should.throw();
  });

  it('should throw without version passed', function () {
    (function () {
      var x = new PackageDependency('package-name');
    }).should.throw();
    (function () {
      var x = new PackageDependency('package-name', undefined);
    }).should.throw();
    (function () {
      var x = new PackageDependency('package-name', null);
    }).should.throw();
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
    x.should.deep.equal({name: 'package-name', version: 'version', local: false});
  });

  it('should work with object version - without local', function () {
    var x = new PackageDependency('package-name', {version: 'version'});
    x.should.deep.equal({name: 'package-name', version: 'version', local: false});
  });

  it('should work with object version - with local', function () {
    var x;
    x = new PackageDependency('package-name', {version: 'version', local: false});
    x.should.deep.equal({name: 'package-name', version: 'version', local: false});
    x = new PackageDependency('package-name', {version: 'version', local: true});
    x.should.deep.equal({name: 'package-name', version: 'version', local: true});
  });

});
