'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

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

  //it('should output usage if no command specified', function () {
  //  return help(parsedArgs)
  //    .then(function () {
  //      process.stdout.write.
  //    })
  //    .should.be.eventually.fulfilled;
  //});

});
