'use strict';

var repository = require('config').get('repository'),
  cookieStoreFileName = require('config').get('cookieStoreFileName'),
  Bluebird = require('bluebird'),
  rp = require('request-promise'),
  chalk = require('chalk'),
  fs = Bluebird.promisifyAll(require('fs')),
  FileCookieStore = require('tough-cookie-filestore');


var login = function (username, password) {

  var localConfigFile = 'config/local.json';

  var options = {
    method: 'POST',
    uri: repository.uri + ':' + repository.port + repository.apiUrl.login,
    body: {
      username: username,
      password: password
    },
    json: true,
    jar: rp.jar(new FileCookieStore(cookieStoreFileName))
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
