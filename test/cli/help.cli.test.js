'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

var CLIError = require('../../lib/cli/error.cli');

describe('$ oradbpm help', function () {

  var help = require('../../lib/cli/help.cli');
  var parsedArgs, stdout;

  before(function () {
    sinon.spy(process.stdout, 'write');
    sinon.spy(process.stderr, 'write');
    stdout = process.stdout.write;
  });

  beforeEach(function () {
    parsedArgs = { _: []};
  });

  it('should output usage if no command specified', function () {
    return help(parsedArgs)
      .then(function () {
        process.stdout.write.lastCall.args.should.match(/Usage:/);
      })
      .should.be.eventually.fulfilled;
  });

  it('should output command help for known command', function () {
    parsedArgs._.unshift('view');
    return help(parsedArgs)
      .then(function () {
        process.stdout.write.lastCall.args.should.match(/Usage: [\S]+ view/i);
      })
      .should.be.eventually.fulfilled;
  });

  it('should throw CLIError for unknown command', function () {
    parsedArgs._.unshift('tradaa');
    return help(parsedArgs)
      .should.be.rejectedWith(CLIError);
  });

});
