'use strict';

var Bluebird = require('bluebird');
var readAsync = Bluebird.promisify(require('read'));
var chalk = require('chalk');
var oraDBPMClient = require('./../main');

/**
 * Logs in into repository server and stores auth cookie in cookie jar file
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  return oraDBPMClient.localConfigFileService.read()
    .then(function (localConfig) {
      return readAsync({prompt: 'Username: ', default: localConfig.username})
        .then(function (username) {
          return readAsync({prompt: 'Password: ', silent: true})
            .then(function (password) {
              return oraDBPMClient.login(username, password)
                .then(function () {
                  console.log(chalk.green('Successfully logged in.\n'));
                });
            });
        });
    })
    .catch(function (err) {
      if (err.name === 'Error' && err.message === 'canceled') {
        console.log('\nLogin canceled');
      } else {
        throw err;
      }
    });
};
