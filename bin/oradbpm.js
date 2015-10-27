#! /usr/bin/env node
'use strict';

var CLI = require('../lib/cli');
var debug = require('debug')('cli');

var cli = new CLI();

cli
  .parse(process.argv)
  .then(function (parsedArgs) {
    return cli.executeCommand(parsedArgs);
  })
  .then(function () {
    //just waiting for resolve and doing nothing
    return undefined;
  })
  .catch(function (err) {
    debug('err', err);
    process.exit(err.exitCode || 1);
  });

