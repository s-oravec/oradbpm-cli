'use strict';

var repository = require('config').get('repository'),
  cookieStoreFileName = require('config').get('cookieStoreFileName'),
  Bluebird = require('bluebird'),
  rp = require('request-promise'),
  chalk = require('chalk'),
  fs = Bluebird.promisifyAll(require('fs')),
  FileCookieStore = require('tough-cookie-filestore');


var login = function (username, password) {

  //TODO: refactor
  var localConfigFile = __dirname + '/../config/local.json';

  var options = {
    method: 'POST',
    uri: repository.uri + ':' + repository.port + '/api/auth/signin',
    body: {
      username: username,
      password: password
    },
    json: true,
    // TODO: refactor
    jar: rp.jar(new FileCookieStore(__dirname + '/../' + cookieStoreFileName))
  };

  rp(options)
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
    })
    .catch(function (err) {
      if (err.error) {
        console.error(chalk.red((err.statusCode ? err.statusCode + ' ' : '') + err.error.message));
      } else {
        console.log(chalk.red(err));
      }
    });
};

exports.login = login;
