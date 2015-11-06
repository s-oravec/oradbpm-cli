'use strict';

var chai = require('chai');
chai.should();

var CLIError = require('../../lib/cli/error.cli');

describe('error.cli', function () {

  it('should create instance of CLIError', function () {
    var cliError = new CLIError();
    cliError.should.be.instanceOf(CLIError);
  });

  it('name should be CLIError', function () {
    var cliError = new CLIError();
    cliError.name.should.be.equal('CLIError');
  });

  it('message should be set to default if not passed to constructor', function () {
    var cliError = new CLIError();
    cliError.message.should.be.equal('Unknown error.');
  });

  it('exitCode should be set to default 1 if not passed to constructor', function () {
    var cliError = new CLIError();
    cliError.exitCode.should.be.equal(1);
  });

  it('message, exitCode passed to constructor should be set on instance', function () {
    var cliError = new CLIError('message', -1);
    cliError.exitCode.should.be.equal(-1);
    cliError.message.should.be.equal('message');
  });

});
