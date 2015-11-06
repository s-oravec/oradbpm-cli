'use strict';

var chai = require('chai');
chai.should();

var oraDBPMClient = require('../lib/main');
var OraDBPMClient = require('../lib/oradbpm-client.js');

describe('main', function () {
  it('should be instance of OraDBPMClient', function () {
    oraDBPMClient.should.be.instanceOf(OraDBPMClient);
  });
});
