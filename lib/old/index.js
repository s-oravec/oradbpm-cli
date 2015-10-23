#! /usr/bin/env node

'use strict';

process.env['NODE_CONFIG_DIR'] = __dirname + '/config';

var program = require('commander'),
  read = require('read'),
  username = require('config').get('username'),
  OraDBPM = require('./oradbpm'),
  pkg = require('./../../package.json');

program.version(pkg.version);

program
  .command('login')
  .description('login into repository account')
  .action(function () {
    read({prompt: 'Username: ', default: username}, function (er, username) {
      read({prompt: 'Password: ', silent: true}, function (er, password) {
        return OraDBPM.login(username, password);
      });
    });
  });

program
  .command('publish')
  .description('publish package into repository')
  .action(function () {
    return OraDBPM.publish();
  });

program
  .command('bump-version <newVersion> | major | minor | patch | premajor | preminor | prepatch | prerelease')
  .description('bump package version')
  .action(function (newVersion) {
    return OraDBPM.bumpVersion(newVersion);
  });

program
  .command('search query')
  .description('search repository for search phrase')
  .action(function (query) {
    return OraDBPM.search(query);
  });

program
  .command('whoami')
  .description('prints username config to stdout')
  .action(function () {
    return OraDBPM.whoami();
  });

program
  .command('logout')
  .description('logs out from repository')
  .action(function () {
    return OraDBPM.logout();
  });

program
  .command('view packageName')
  .description('prints package from repositry')
  .action(function (packageName) {
    return OraDBPM.view(packageName);
  });

//program
//  .command('get moduleName')
//  .option('-s, --save', 'save as dependency to OraDBPM package definition')
//  .description('get package from repository')
//  .action(function (moduleName) {
//    console.log('moduleName',moduleName);
//    console.log('save option', program.save);
//  })
//;

program.parse(process.argv);
