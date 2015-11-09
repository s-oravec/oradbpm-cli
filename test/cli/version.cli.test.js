'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var OraDBPMClientError = require('../../lib/oradbpm-client/common/error').OraDBPMClientError;

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('version.cli', function () {

  var OraDBPMClient = require('../../lib/oradbpm-client');
  var parsedArgs, command, cli;

  before(function () {
    cli = {
      oraDBPMClient: new OraDBPMClient()
    };
    command = require('../../lib/cli/version.cli');
    sinon.spy(cli.oraDBPMClient, 'version');
  });

  it('should call OraDBPMClient.version', function () {
    parsedArgs = {_: []};
    return command.call(cli, parsedArgs)
      .catch(function (err) {
        // eat OraDBPMClientError errors
        if (!(err instanceof OraDBPMClientError)) throw err;
      })
      .finally(function () {
        cli.oraDBPMClient.version.called.should.be.equal(true);
      });
  });

});
