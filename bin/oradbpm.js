#! /usr/bin/env node
'use strict';

var CLI = require('../lib/cli');
var debug = require('debug')('oradbpm:bin');
var chalk = require('chalk');

var cli = new CLI();

cli
  .parse(process.argv)
  .then(function (parsedArgs) {
    return cli.callCommand(parsedArgs);
  })
  .catch(function (err) {
    debug('error', err.exitCode);
    debug('error', err.name);
    debug('error', err.message);
    console.log(chalk.red([err.name, err.exitCode, err.message].join(':')));
    process.exit(err.exitCode || 1);
  });

