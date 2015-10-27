'use strict';

var Bluebird = require('bluebird'),
  chalk = require('chalk'),
  // TODO: refactor to local config service
  fs = Bluebird.promisifyAll(require('fs')),
  oraDBPMClient = require('./../../../main');

var login = function (username, password) {

  //TODO: refactor
  var localConfigFile = __dirname + '/../config/local.json';
  // 0. call service
  return oraDBPMClient.repositoryService.login(username, password)
    // 1. read config
    .then(function () {
      return fs.readFileAsync(localConfigFile, 'utf8');
    })
    // 2. parse json
    .then(function (content) {
      if (!!content) {
        return JSON.parse(content);
      } else {
        return {};
      }
    })
    .then(function (localConfigJSON) {
      // 3. set username
      localConfigJSON.username = username;
      // 4. stringify & write
      return fs.writeFileAsync(localConfigFile, JSON.stringify(localConfigJSON, null, 2))
    })
    .then(function () {
      console.log(chalk.green('Successfully logged in.\n'));
    });
};

module.exports = login;
