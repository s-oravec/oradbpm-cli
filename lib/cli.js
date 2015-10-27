'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var debug = require('debug')('cli');

function CLIError(message, exitCode) {
  this.name = 'CLIError';
  this.message = message;
  this.exitCode = exitCode || 1;
}

var CLI = function () {
  var self = this;
  return self;
};

/**
 * parse arguments - be generous with help
 * @param argv array of arguments e.g. process.argv
 * @returns {*} parsed arguments minimist-style
 */
CLI.prototype.parse = function (argv) {
  var parseArgs = require('minimist');
  var parsedArgs = parseArgs(argv.splice(2), {
    boolean: [
      'h', 'help',
      's', 'save',
      ''
    ]
  });

  // support --help <command> | -h <command>
  if (parsedArgs.help || parsedArgs.h) {
    parsedArgs._.unshift('help');
    parsedArgs.help = parsedArgs.h = true;
  }

  // support <command> help
  if (parsedArgs._[parsedArgs._.length - 1] === 'help' && parsedArgs._.length > 1) {
    parsedArgs._.pop();
    parsedArgs._.unshift('help');
    parsedArgs.help = parsedArgs.h = true;
  }

  // no command displays help
  if (!parsedArgs._.length) {
    parsedArgs._.unshift('help');
    parsedArgs.help = parsedArgs.h = true;
  }

  debug('Parsed args', parsedArgs);
  return Bluebird.resolve(parsedArgs);
};

CLI.prototype.executeCommand = function (parsedArgs) {
  var self = this;
  var command = parsedArgs._.shift();
  // if command is registered
  if (typeof self[command] === 'function') {
    debug('Calling command', command, 'with arguments', parsedArgs);
    // call command with rest of arguments
    return self[command].call(self, parsedArgs);
  } else {
    var message = 'Unknown command ' + command;
    debug(message);
    // output error message
    console.log(chalk.red(message));
    return self
      // show usage help
      .help()
      // then throw unknown command
      .then(function () {
        return Bluebird.reject(new CLIError(message));
      });
  }
};

var registerCommand = function (command, fn) {
  CLI.prototype[command] = fn;
};

registerCommand('help', require('./cli/help'));
registerCommand('version', require('./cli/version'));
registerCommand('login', require('./cli/login'));

module.exports = CLI;
