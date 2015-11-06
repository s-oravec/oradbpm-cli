'use strict';

var path = require('path');
var Bluebird = require('bluebird');
var fs = Bluebird.promisifyAll(require('fs'));
var debug = require('debug')('oradbpm:cli:help');
var CLIError = require('./error.cli');

/**
 *
 * @returns {*} promise
 * @param parsedArgs - minimist-style parsed args
 */
module.exports = function (parsedArgs) {
  var command;
  if (parsedArgs && parsedArgs._) {
     command = parsedArgs._.shift();
  } else {
    command = undefined;
  }
  debug('help for command', command);
  // filename format: oradbpm-client.txt | oradbpm-client.command.txt
  var filepath = path.join('doc', 'cli', 'oradbpm' + (command ? '.' + command : '') + '.txt');
  debug('going to show help from', filepath);

  return fs.readFileAsync(filepath, 'utf8')
    .then(function (data) {
      data = data.trim();
      console.log('\n' + data + '\n');
      return Bluebird.resolve();
    })
    .catch(function (err) {
      console.log(err);
      if (err.code === 'ENOENT') {
        throw new CLIError('Unknown command ' + command);
      }
      throw err;
    });
};
