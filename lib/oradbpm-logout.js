'use strict';

var repository = require('config').get('repository'),
  cookieStoreFileName = require('config').get('cookieStoreFileName'),
  rp = require('request-promise'),
  chalk = require('chalk'),
  FileCookieStore = require('tough-cookie-filestore')
  ;


var logout = function (username, password) {

  var localConfigFile = 'config/local.json';

  var options = {
    method: 'GET',
    uri: repository.uri + ':' + repository.port + repository.apiUrl.logout,
    jar: rp.jar(new FileCookieStore(cookieStoreFileName))
  };

  rp(options)
    .then(function () {
      console.log(chalk.green('Successfully logged out.\n'));
    })
    .catch(function (err) {
      if (err.error) {
        console.error(chalk.red((err.statusCode ? err.statusCode + ' ' : '') + err.error.message));
      } else {
        console.log(chalk.red(err));
      }
    });
};

exports.logout = logout;
