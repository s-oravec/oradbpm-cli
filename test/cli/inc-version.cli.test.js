'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var Bluebird = require('bluebird');
var fs = Bluebird.promisifyAll(require('fs'));
var shell = require('shelljs');

shell.config.silent = true;

// TODO: nice, nice ... but refactoring for better testability has been done to perform test on controller, not on cli ...
// TODO: so move test of work done by controller to controller test
describe('inc-version cli', function () {

  var git_repo = 'test/tmp/inc-version/git-repo';
  var pkg_local = 'test/tmp/inc-version/local';
  var pkg_image = 'test/fixtures/packages/inc-version';

  beforeEach(function () {
    // cleanup
    shell.rm('-rf','test/tmp/inc-version');
    // create repo
    shell.exec('git init ' + git_repo + ' --bare');
    // clone from repo
    shell.exec('git clone ' + git_repo + ' ' + pkg_local);
    // copy package to clone
    shell.exec('cp ' + pkg_image + '/oradb_package.json ' + pkg_local);
    shell.ln('-s','bin/oradbpm.js',pkg_local + '/oradbpm');
    // link bin
    shell.chmod(700, pkg_local + '/oradbpm');
    shell.pushd(pkg_local);
    shell.exec('git add oradb_package.json');
    shell.exec('git add commit -m "init"');
    shell.exec('git push');
  });

  it('should inc version, write it to package file, tag working copy and push it to repository', function () {
    var oradb_package_before = require(__dirname + '/../tmp/inc-version/local/oradb_package.json');
    oradb_package_before.version.should.be.equal('0.0.1');
    shell.exec('./oradbpm inc-version minor', function (code, output) {
      output.should.be.equal('New package version is 0.1.0.\n');
      return fs.readFileAsync(__dirname + '/../tmp/inc-version/local/oradb_package.json')
        .then(function (content) {
          JSON.parse(content).version.should.be.equal('0.1.0');
        })
        .should.be.eventually.fulfilled;
    });
  });

  afterEach(function () {
    shell.popd();
  });


});
