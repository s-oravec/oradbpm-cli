'use strict';

var username = require('config').get('username'),
  chalk = require('chalk');

var whoami = function () {
  if (username === '') {
    console.log(chalk.red('Who are you?, who? who?, who? who?'));
    console.log(chalk.red('Use oradbpm login to login.'));
  } else {
    console.log(chalk.green('You\'re "' + username + '"'));
  }
};

exports.whoami = whoami;
