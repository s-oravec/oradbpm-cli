'use strict';

function CLIError (message, exitCode) {
  this.name = 'CLIError';
  this.message = message;
  this.exitCode = exitCode || 1;
}

module.exports = CLIError;
