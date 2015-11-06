'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var path = require('path');

chai.use(chaiAsPromised);
chai.should();

describe('cli.parse', function () {

  var CLI = require('../../lib/cli');
  var cli, argv;

  beforeEach(function () {
    cli = new CLI();
    argv = ['node', path.join(__dirname, '../../bin/oradbpm')];
  });

  it('should unshift help command if no command specified', function () {
    return cli
      .parse(argv)
      .then(function (parsedArgs) {
        parsedArgs._[0].should.equal('help');
      })
      .should.be.eventually.fulfilled;
  });

  it('should unshift help command if -h option specified', function () {
    return cli
      .parse(argv.concat(['-h']))
      .then(function (parsedArgs) {
        parsedArgs._[0].should.equal('help');
      })
      .should.be.eventually.fulfilled;
  });

  it('should unshift help command if --help option specified', function () {
    return cli
      .parse(argv.concat(['--help']))
      .then(function (parsedArgs) {
        parsedArgs._[0].should.equal('help');
      })
      .should.be.eventually.fulfilled;
  });

  it('should unshift version command if -v option specified', function () {
    return cli
      .parse(argv.concat(['-v']))
      .then(function (parsedArgs) {
        parsedArgs._[0].should.equal('version');
      })
      .should.be.eventually.fulfilled;
  });

  it('should unshift version command if --version option specified', function () {
    return cli
      .parse(argv.concat(['--version']))
      .then(function (parsedArgs) {
        parsedArgs._[0].should.equal('version');
      })
      .should.be.eventually.fulfilled;
  });

});
