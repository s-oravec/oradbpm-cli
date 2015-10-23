#! /usr/bin/env node
'use strict';

var CLI = require('../lib/cli');

var cli = new CLI();
cli
  .parse(process.argv)
  .catch(function (err) {
    proces.exit(err.exitCode || 1);
  });

