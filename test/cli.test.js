'use strict';

var chai = require('chai');
chai.should();

var shell = require('shelljs');
var path = require('path');
var bin = 'node ' + '"' + path.resolve(path.join(__dirname, '..', 'bin', 'oradbpm.js')) + '"';

describe('$ oradbpm [options] commands', function () {

  it('should support no arguments', function () {
    var output = shell.exec(bin + '', {silent: true}).output;
    output.should.match(/Usage:/);
  });

  it('should support commands', function() {
    var output = shell.exec(bin + ' version', { silent: true }).output;
    output.should.match(/^\w+\.\w+\.\w+/);
  });

  it('should support options', function() {
    var output = shell.exec(bin + ' --version', { silent: true }).output;
    output.should.match(/^\w+\.\w+\.\w+/);
  });

  it('should have exit code 0', function() {
    var code = shell.exec(bin + ' --version', { silent: true }).code;
    code.should.be.equal(0);
  });

  describe('on an error', function() {
    it('should have non-zero exit code', function() {
      var code = shell.exec(bin + ' tradaa', { silent: true }).code;
      code.should.not.equal(0);
    });
  });

});
