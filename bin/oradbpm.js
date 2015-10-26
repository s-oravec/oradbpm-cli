#! /usr/bin/env node
'use strict';

var CLI = require('../lib/cli');

var cli = new CLI();

cli
  .parse(process.argv)
  .then(function (parsedArgs) {
    return cli.executeCommand(parsedArgs);
  })
  .catch(function (err) {
    process.exit(err.exitCode || 1);
  });

