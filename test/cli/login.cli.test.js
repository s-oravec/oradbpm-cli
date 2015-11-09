'use strict';

/*
if (process.argv[2] === 'child') {
  return child()
}

var CLOSE = 'close';
if (process.version.match(/^v0\.6/)) {
  CLOSE = 'exit';
}

var spawn = require('child_process').spawn;

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var path = require('path');
var OraDBPMClientError = require('../../lib/oradbpm-client/common/error').OraDBPMClientError;

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe.only('login.cli', function () {

  it('should call OraDBPMClient.login', function (done) {

    //var child = spawn(process.execPath, [__filename, 'child']);
    var child = spawn(process.execPath, [__filename, 'child']);
    var output = '';
    var write = child.stdin.write.bind(child.stdin);

    child.stdout.on('data', function (c) {
      console.error('data %s', c);
      output += c;
      // if (output.match(/Username: \(test-user\) $/)) {
      if (output.match(/Username:/)) {
        process.nextTick(write.bind(null, 'username\n'))
      } else if (output.match(/Password:/)) {
        process.nextTick(write.bind(null, 'password\n'))
      } else {
        console.error('prompts done, output=%j', output)
      }
    });

    var result = '';
    child.stderr.on('data', function (c) {
      result += c;
      console.error('result %j', c.toString())
      done();
    });

    child.on(CLOSE, function () {
      console.log(result);
      result = JSON.parse(result);
      done();
    });
  });
});

function child() {

  var OraDBPMClient = require('../../lib/oradbpm-client');
  var command, cli;

  cli = {
    oraDBPMClient: new OraDBPMClient()
  };
  command = require('../../lib/cli/login.cli');
  //sinon.spy(cli.oraDBPMClient, 'login');

  var parsedArgs = {_: []};
  //console.error('before command call');
  return command.call(cli, parsedArgs)
    .then(function () {
      console.error('then')
    })
    .catch(function () {
       // eat OraDBPMClientError errors
       if (!(err instanceof OraDBPMClientError)) throw err;
    });
    //.finally(function () {
    //  cli.oraDBPMClient.login.called.should.be.equal(true);
    //});
}
*/
