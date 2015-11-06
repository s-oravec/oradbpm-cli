'use strict';

function CLIError (message, exitCode) {
  this.name = 'CLIError';
  this.message = message || 'Unknown error.';
  this.exitCode = exitCode || 1;
}

module.exports = CLIError;
