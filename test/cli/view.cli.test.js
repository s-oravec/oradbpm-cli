'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var path = require('path');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('view.cli', function () {

  var CLIError = require('../../lib/cli/error.cli');
  var OraDBPMClient = require('../../lib/oradbpm-client');
  var parsedArgs, command, cli;

  before(function () {
    cli = {
      oraDBPMClient: new OraDBPMClient()
    };
    command = require('../../lib/cli/view.cli');
    sinon.spy(cli.oraDBPMClient, 'view');
  });

  it('should call OraDBPMClient.view with package name', function () {
    parsedArgs = {_: ['sqlsn-core']};
    return command.call(cli, parsedArgs)
      .catch(function (err) {
        // eat package repo errors for tests without repo running
        if (err.name !== 'PackageRepositoryServiceError') throw err;
      })
      .then(function () {
        cli.oraDBPMClient.view.lastCall.args[0].should.equal('sqlsn-core');
      });
  });

  it('should throw CLIError if no package name passed', function () {
    parsedArgs = {_: []};
    return command.call(cli, parsedArgs)
      .catch(function (err) {
        throw err;
      })
      .then(function () {
        console.log('in then?');
        chai.fail();
      })
      .catch(function (err) {
        err.should.be.instanceOf(CLIError);
        err.exitCode.should.be.equal(1);
      });
  });

});
