'use strict';

var repository = require('config').get('repository'),
  cookieStoreFileName = require('config').get('cookieStoreFileName'),
  request = require('request'),
  chalk = require('chalk'),
  //fs = require('Bluebird').promisifyAll(require('fs')),
  FileCookieStore = require('tough-cookie-filestore');


exports.login = function (username, password) {

  var jar = request.jar(new FileCookieStore(cookieStoreFileName));

  var options = {
    method: 'POST',
    uri: repository.uri + ':' + repository.port + repository.method.login,
    body: {
      username: username,
      password: password
    },
    json: true,
    jar: jar
  };

  request(options, function (err, r, body) {
    if (!err) {
      console.log(chalk.green('Successfully logged in.'));
      //TODO: store username to config
    }
  });

};
