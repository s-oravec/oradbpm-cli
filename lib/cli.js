'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var debug = require('debug')('oradbpm:cli');
var CLIError = require('./cli/error.cli');

/**
 * CLI error handler
 * @param err
 */
var handleError = function (err) {
  debug('error %s', err.exitCode);
  debug('error %s', err.name);
  debug('error %s', err.message);
  console.log(chalk.red([err.exitCode, err.name, err.message].join(':')));
  process.exit(err.exitCode || 1);
};

/**
 *
 * @returns {CLI}
 * @constructor
 */
var CLI = function () {

  // bind cli commands
  this.help = require('./cli/help.cli').bind(this);
  this.version = require('./cli/version.cli').bind(this);

  // auth
  this.login = require('./cli/login.cli').bind(this);
  this.logout = require('./cli/logout.cli').bind(this);
  this.whoami = require('./cli/whoami.cli.js').bind(this);

  // package
  this['inc-version'] = require('./cli/inc-version.cli').bind(this);
  this.publish = require('./cli/publish.cli').bind(this);
  this.search = require('./cli/search.cli').bind(this);
  this.view = require('./cli/view.cli').bind(this);
  this.get = require('./cli/get.cli').bind(this);

  return this;
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
      'save-dev',
      'l', 'local',
      'g', 'global'
    ]
  });

  // support -v --version > version
  if (parsedArgs.version || parsedArgs.v) {
    parsedArgs._.unshift('version');
  }

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

  debug('Parsed args %s', JSON.stringify(parsedArgs));
  return Bluebird.resolve(parsedArgs);
};

/**
 * Call cli command with arguments
 * @param parsedArgs
 * @returns {*} promise
 */
CLI.prototype.callCommand = function (parsedArgs) {
  var self = this;
  var command = parsedArgs._.shift();
  // if command is registered
  if (typeof self[command] === 'function') {
    debug('Calling command %s with arguments %s', command, JSON.stringify(parsedArgs));
    // call command with rest of arguments
    return self[command].call(self, parsedArgs)
      .catch(handleError);
  } else {
    var message = 'Unknown command ' + command;
    debug(message);
    return self
    // show usage help
      .help()
      // then throw unknown command
      .then(function () {
        throw new CLIError(message);
      })
      .catch(handleError);
  }
};

module.exports = CLI;
