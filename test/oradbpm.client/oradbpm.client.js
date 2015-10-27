'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var oraDBPMClient = require('./../../lib/oradbpm.client');

describe('OraDBPMClient', function () {

  var oradbpmclient = new oraDBPMClient();

  it('should instantiate correctly', function () {
    //services
    oradbpmclient.should.have.property('packageRepositoryService');
    oradbpmclient.should.have.property('localConfigFileService');
    //methods
    oradbpmclient.should.have.property('login');
  });

});
