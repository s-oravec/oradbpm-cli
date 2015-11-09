'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var path = require('path');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('logout.cli', function () {

  var OraDBPMClient = require('../../lib/oradbpm-client');
  var parsedArgs, command, cli;

  before(function () {
    cli = {
      oraDBPMClient: new OraDBPMClient()
    };
    command = require('../../lib/cli/logout.cli');
    sinon.spy(cli.oraDBPMClient, 'logout');
  });

  it('should call OraDBPMClient.logout', function () {
    parsedArgs = {_: []};
    return command.call(cli, parsedArgs)
      .catch(function () {
        // eat all errors
      })
      .finally(function () {
        cli.oraDBPMClient.logout.called.should.be.equal(true);
      });
  });

});
