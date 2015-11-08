'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var path = require('path');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe.only('whoami.cli', function () {

  var OraDBPMClient = require('../../lib/oradbpm-client');
  var parsedArgs, command, cli;

  before(function () {
    cli = {
      oraDBPMClient: new OraDBPMClient()
    };
    command = require('../../lib/cli/whoami.cli');
    sinon.spy(cli.oraDBPMClient, 'whoami');
  });

  it('should call OraDBPMClient.whoami', function () {
    parsedArgs = {_: []};
    return command.call(cli, parsedArgs)
      .catch(function () {
        // eat all errors
      })
      .finally(function () {
        cli.oraDBPMClient.whoami.called.should.be.equal(true);
      });
  });

});
