'use strict';

var read = require('read');
var oraDBPMClient = require('./../main');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  return oraDBPMClient.localConfigFileService.read()
    .then(function (localConfig) {
      read({prompt: 'Username: ', default: localConfig.username}, function (err, username) {
        read({prompt: 'Password: ', silent: true}, function (err, password) {
          return oraDBPMClient.login(username, password);
        });
      });
    });
};
