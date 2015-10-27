'use strict';

var read = require('read');
var oraDBPMClient = require('./../main');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  // TODO: read default username from local config
  read({prompt: 'Username: ', default: 'stiivo'}, function (er, username) {
    read({prompt: 'Password: ', silent: true}, function (er, password) {
      return oraDBPMClient.login(username, password);
    });
  });
};
