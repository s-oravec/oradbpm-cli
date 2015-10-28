'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var shell = require('shelljs');

describe('inc-version cli', function () {

  var git_repo = 'test/tmp/inc-version/git-repo';
  var pkg_local = 'test/tmp/inc-version/local';
  var pkg_image = 'test/fixtures/packages/inc-version';
  var options = {silent: true};

  before(function () {
    // cleanup
    shell.exec('rm -rf test/tmp/inc-version', options);
    // create repo
    shell.exec('git init ' + git_repo + ' --bare', options);
    // clone from repo
    shell.exec('git clone ' + git_repo + ' ' + pkg_local, options);
    // copy package to clone
    shell.exec('cp ' + pkg_image + '/oradb_package.json ' + pkg_local, options);
  });

  it('', function () {
    shell.exec('export DEBUG=*');

    shell.exec('pushd ' + pkg_local + ' && oradbpm inc-version minor && popd');
  });

});
