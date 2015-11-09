'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var path = require('path');
var OraDBPMClientError = require('../../lib/oradbpm-client/common/error').OraDBPMClientError;

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('publish.cli', function () {

  var CLIError = require('../../lib/cli/error.cli');
  var OraDBPMClient = require('../../lib/oradbpm-client');
  var parsedArgs, command, cli;

  before(function () {
    cli = {
      oraDBPMClient: new OraDBPMClient()
    };
    command = require('../../lib/cli/publish.cli');
    sinon.spy(cli.oraDBPMClient, 'publish');
  });

  it('should call OraDBPMClient.publish with local oradb_package.json if not oradbpm-dir specified', function () {
    parsedArgs = {_: []};
    var packageFilePath = path.join(process.cwd(), 'oradb_package.json');
    return command.call(cli, parsedArgs)
      .catch(function (err) {
        // eat OraDBPMClientError errors
        if (!(err instanceof OraDBPMClientError)) throw err;
      })
      .then(function () {
        cli.oraDBPMClient.publish.lastCall.args[0].should.equal(packageFilePath);
      });
  });

  it('should call OraDBPMClient.publish with oradb_package.json specified in oradbpm-dir option', function () {
    parsedArgs = {_: [], 'oradbpm-dir': 'foo/bar'};
    var packageFilePath = path.join(process.cwd(), 'foo/bar', 'oradb_package.json');
    return command.call(cli, parsedArgs)
      .catch(function (err) {
        // eat OraDBPMClientError errors
        if (!(err instanceof OraDBPMClientError)) throw err;
      })
      .then(function () {
        cli.oraDBPMClient.publish.lastCall.args[0].should.equal(packageFilePath);
      });
  });

  it('should call OraDBPMClient.publish with tag specified in tag option', function () {
    parsedArgs = {_: [], tag: 'beta'};
    return command.call(cli, parsedArgs)
      .catch(function (err) {
        // eat OraDBPMClientError errors
        if (!(err instanceof OraDBPMClientError)) throw err;
      })
      .then(function () {
        cli.oraDBPMClient.publish.lastCall.args[1].should.equal('beta');
      });
  });

});
