'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var path = require('path');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('search.cli', function () {

  var CLIError = require('../../lib/cli/error.cli');
  var OraDBPMClient = require('../../lib/oradbpm-client');
  var parsedArgs, search, cli;

  before(function () {
    cli = {
      oraDBPMClient: new OraDBPMClient()
    };
    search = require('../../lib/cli/search.cli');
    sinon.spy(cli.oraDBPMClient, 'search');
  });

  it('should call OraDBPMClient.search with query', function () {
    parsedArgs = {_: ['sqlsn-core']};
    return search.call(cli, parsedArgs)
      .catch(function (err) {
        // eat package repo errors for tests without repo running
        if (err.name !== 'PackageRepositoryServiceError') throw err;
      })
      .then(function () {
        cli.oraDBPMClient.search.lastCall.args[0].should.equal('sqlsn-core');
      });
  });

  it('should throw if no query passed', function () {
    parsedArgs = {_: []};
    return search.call(cli, parsedArgs)
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
