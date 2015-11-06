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

  var CLI = require('../../lib/cli');
  var cli, argv, stdout;

  beforeEach(function () {
    cli = new CLI();
    argv = ['node', path.join(__dirname, '../../bin/oradbpm')];
    //spyOn(process.stdout, 'write');
    //spyOn(process.stderr, 'write');
    stdout = process.stdout.write;
  });



});
