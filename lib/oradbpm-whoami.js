'use strict';

var repository = require('config').get('repository'),
  chalk = require('chalk');

var whoami = function () {

  if (repository.username === undefined || repository.username === "undefined") {
    console.log(chalk.red('Who are you?, who? who?, who? who?'));
    console.log(chalk.red('Use oradbpm login to login.'));
  } else {
    chalk.green('You\'re "' + repository.username + '"');
  }
};

exports.whoami = whoami;
